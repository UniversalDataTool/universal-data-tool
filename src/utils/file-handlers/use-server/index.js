// @flow

import { useState, useEffect } from "react"
import moment from "moment"
// import { useToasts } from "../../../components/Toasts"
import seamless from "seamless-immutable"
import applySeamlessPatch from "./apply-seamless-patch"
import CollaborationHandler from "./handler.js"

const { setIn, from: makeImmutable } = seamless

const serverUrl =
  window.localStorage.CUSTOM_COLLABORATION_SERVER ||
  "https://udt-collaboration-server.now.sh"

// We use a global singleton to manage the collaboration state machine
const collab = new CollaborationHandler({ serverUrl })

export const convertToCollaborativeFile = async (file) => {
  await collab.createSession(file.content)
  return {
    fileName: file.fileName,
    id: file.id,
    sessionId: collab.sessionId,
    url: `${window.location.origin}?s=${collab.sessionId}`,
    content: file.content,
    mode: "server",
  }
}

export const joinSession = async (sessionId) => {
  await collab.joinSession(sessionId)
  return {
    state: collab.state,
    version: collab.version,
  }
}

export default (file, changeFile) => {
  // const { addToast } = useToasts()
  const userName = window.localStorage.userName
  useEffect(() => {
    if (userName && !userName.includes("anonymous")) {
      try {
        collab.userName = JSON.parse(window.localStorage.userName)
      } catch (e) {}
    }
  }, [userName])

  useEffect(() => {
    if (!file || file.mode !== "server") return
    if (file.sessionId !== collab.sessionId) return

    const checkForLatestPatch = async () => {
      const applyResult = await collab.applyLatestPatches()

      if (applyResult) {
        changeFile({
          ...file,
          content: collab.state,
        })
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
    async function doPatch() {
      const patchResult = await collab.sendPatchIfChanged(file.content)
    }
    doPatch()
  }, [file && file.content])
}
