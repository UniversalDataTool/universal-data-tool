import axios from "axios"

const uploadFileToTransferSh = async({ fileName, fileURL, remote }) => {
    const remoteURL = `https://files.universaldatatool.com` ///${hashedFileName}

    let data = new FormData();
    const exactFilePath = fileURL.split("file://")[1]

    const newFile = await remote.require("fs").createReadStream(exactFilePath)
    data.append("body-file", newFile);

    const uploadedFileURL = await axios.post(remoteURL, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        .then(response => {
            if (response.status === 200) {
                console.log(response)
                return response.data
            }
        })
        .catch(error => console.warn(error));
    return uploadedFileURL
}

export default uploadFileToTransferSh