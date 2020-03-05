// @flow

import { useState, useEffect } from "react"
import bent from "bent"
import moment from "moment"

const server = "http://localhost:3000"

const getJSON = bent("json", "GET")
const postJSON = bent("json", "POST")

export const getLatestState = async sessionId => {
  return await getJSON(`/api/session/${sessionId}`)
}

export const convertToCollaborativeFile = async file => {
  const response = await postJSON("/api/session", { udt: file.content })
  return {
    id: response.session_id,
    sessionId: response.session_id,
    url: `${window.location.origin}?s=${response.session_id}`,
    content: file.content,
    lastSync: moment.utc(),
    mode: "server"
  }
}

export default (file, changeFile) => {
  // TODO polling
  useEffect(() => {
    if (file.mode !== "server") return

    let interval = setInterval(() => {}, [])

    return () => {
      clearInterval(interval)
    }
  }, [file.mode])

  // TODO updating
  useEffect(() => {}, [file])
}
