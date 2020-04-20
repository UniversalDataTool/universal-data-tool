const putFileURLsToAnArray = (taskData) => {
    const mixedFilesArray = []
    const videoURLs = []
    const imageURLs = []

    if (taskData.length > 0) {
        for (const file of taskData) {
            if (file.videoUrl) {
                videoURLs.push(file.videoUrl)
            } else if (file.imageUrl) {
                imageURLs.push(file.imageUrl)
            }
        }
    }

    mixedFilesArray.push(...videoURLs)
    mixedFilesArray.push(...imageURLs)

    const uniqueMixedFilesArray = [...new Set(mixedFilesArray)]
    return uniqueMixedFilesArray
}

export default putFileURLsToAnArray