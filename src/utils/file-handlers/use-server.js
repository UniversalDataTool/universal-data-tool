// @flow

import { useState, useEffect } from "react"
import bent from "bent"
import moment from "moment"
import * as jsonpatch from "fast-json-patch"
import objectHash from "object-hash"
import cloneDeep from "lodash/cloneDeep"
import isEqual from "lodash/isEqual"
import { useToasts } from "../../components/Toasts"

const serverUrl = window.localStorage.useLocalCollaborationServer
  ? "http://localhost:3000"
  : "https://udt-collaboration.workaround.now.sh"

const getJSON = bent("json", "GET", serverUrl)
const postJSON = bent("json", "POST", serverUrl)
const patchJSON = bent("json", "PATCH", serverUrl)

const hash = o => objectHash(JSON.parse(JSON.stringify(o)))

export const getLatestState = async sessionId => {
  try {
    const res = await getJSON(`/api/session/${sessionId}`)
    return {
      state: res.udt_json,
      version: res.version
    }
  } catch (e) {
    console.log(`error getting session "${sessionId}"`)
    return { state: null, version: null }
  }
}

export const convertToCollaborativeFile = async file => {
  const response = await postJSON("/api/session", { udt: file.content })
  return {
    id: response.short_id,
    sessionId: response.short_id,
    url: `${window.location.origin}?s=${response.short_id}`,
    content: file.content,
    lastSyncedVersion: response.version,
    lastSyncedState: cloneDeep(file.content),
    mode: "server"
  }
}

export default (file, changeFile) => {
  const { addToast } = useToasts()
  useEffect(() => {
    if (!file || file.mode !== "server") return

    const checkForLatestPatch = async () => {
      const {
        patch,
        hashOfLatestState,
        latestVersion,
        changeLog
      } = await getJSON(
        `/api/session/${file.sessionId}/diffs?since=${file.lastSyncedVersion}`
      )
      if (!timeout) return
      for (const { userName, op, path } of changeLog) {
        if (path.startsWith("/interface")) {
          addToast(`${userName} changed the project settings`, "warning")
        } else if (path.startsWith("/taskOutput")) {
          addToast(
            `${userName} labeled sample ${
              path.match(/\/taskOutput\/([^\/]+)/)[1]
            }`
          )
        } else if (path.startsWith("/taskData")) {
          addToast(`${userName} changed the sample data`, "warning")
        } else {
          addToast(`${userName} did a ${op} at ${path}`)
        }
      }
      if (patch.length > 0) {
        let patchFailed = false,
          patchResult
        try {
          // Apply update (note: this violates immutability, but prevents rerenders
          // so should be kept)
          patchResult = jsonpatch.applyPatch(file.content, patch, false, true)
          file.content = patchResult.newDocument
        } catch (e) {
          patchFailed = true
        }
        if (patchFailed || hash(file.content) !== hashOfLatestState) {
          if (!patchFailed) {
            console.log(
              "when getting diffs, hashes were not equal! getting latest version from server..."
            )
          } else {
            console.log(
              "when getting diffs, the patch failed! getting latest version from server..."
            )
          }
          const { state: latest, version } = await getLatestState(
            file.sessionId
          )
          changeFile({
            ...file,
            content: latest,
            lastSyncedState: cloneDeep(latest),
            lastSyncedVersion: version
          })
        } else {
          changeFile({
            ...file,
            content: file.content,
            lastSyncedState: cloneDeep(file.content),
            lastSyncedVersion: latestVersion
          })
        }
      }
      if (!timeout) return
      timeout = setTimeout(checkForLatestPatch, 500)
    }

    let timeout = setTimeout(checkForLatestPatch, 500)

    return () => {
      clearTimeout(timeout)
      timeout = null
    }
  }, [file])

  // Update the Server State by Sending Patches
  useEffect(() => {
    if (!file || file.mode !== "server") return
    async function sendPatchIfChanges() {
      const patch = jsonpatch.compare(file.lastSyncedState, file.content)
      if (patch.length === 0) return
      let userName = "anonymous"
      try {
        userName = JSON.parse(window.localStorage.userName)
      } catch (e) {}
      const { hashOfLatestState, latestVersion } = await patchJSON(
        `/api/session/${file.sessionId}`,
        { patch, userName }
      )
      if (hash(file.content) !== hashOfLatestState) {
        console.log(
          "after patch, hashes were not equal! getting latest version from server..."
        )
        const { state: latest, version } = await getLatestState(file.sessionId)
        changeFile({
          ...file,
          content: latest,
          lastSyncedState: latest,
          lastSyncedVersion: version
        })
      } else {
        changeFile({
          ...file,
          content: file.content,
          lastSyncedState: cloneDeep(file.content),
          lastSyncedVersion: latestVersion
        })
      }
    }
    sendPatchIfChanges()
  }, [file && file.content])
}
