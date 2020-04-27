const uploadFileToTransferSh = async ({ fileName, fileURL, remote }) => {
  window.remote = remote // TODO remove
  const remoteURL = `https://files.universaldatatool.com/${fileName}` ///${hashedFileName}

  const axios = remote.require("axios")
  const exactFilePath = fileURL.split("file://")[1]

  const fsFileBuffer = remote.require("fs").readFileSync(exactFilePath)

  const uploadedFileURL = await axios
    .put(remoteURL, fsFileBuffer)
    .then((response) => {
      if (response.status === 200) {
        return response.data
      }
    })

  return uploadedFileURL.replace(
    "universaldatatool.com/",
    "universaldatatool.com/get/"
  )
}

export default uploadFileToTransferSh
