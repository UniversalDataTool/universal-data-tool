import React, { useCallback, useState } from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Box from "@material-ui/core/Box"
import { useDropzone } from "react-dropzone"

const Container = styled(Box)({
  width: 400,
  height: 200,
  padding: 20,
  border: `2px dotted ${colors.grey[400]}`,
  textAlign: "center",
  fontSize: 24,
})

const FileCounter = styled(Box)({
  fontSize: 24,
  color: colors.grey[700],
  fontWeight: "bold",
})

/*
  This component allows you to upload multiple files, then reads the files in
  serial. It's perfect for an uploading process where you don't want to upload one
  file at a time. It gives a progress bar indicating upload progres.
*/

export const MultiFileDrop = ({ loadFile, onComplete }) => {
  const [totalUploaded, setTotalUploaded] = useState(0)
  const [errors, setErrors] = useState([])
  const [{ totalFiles, filesSelected }, setUploadStartState] = useState({
    filesSelected: false,
  })
  const onDrop = useCallback(async (acceptedFiles) => {
    setUploadStartState({
      totalFiles: acceptedFiles.length,
      filesSelected: true,
    })
    const errors = []
    for (const [index, file] of acceptedFiles.entries()) {
      await loadFile(file).catch((err) => {
        errors.push(err.toString())
        setErrors(errors)
      })
      setTotalUploaded(index + 1)
    }
    onComplete()
    // eslint-disable-next-line
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  if (!filesSelected) {
    return (
      <Container {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </Container>
    )
  }

  return (
    <Container>
      <FileCounter>
        {totalUploaded} / {totalFiles} Files Processed
      </FileCounter>
      {/* TODO progress bar */}
      <Box
        maxHeight={100}
        overflowY="auto"
        textAlign="left"
        color="red"
        fontSize={12}
      >
        {errors.map((err, i) => (
          <div key={i}>{err}</div>
        ))}
      </Box>
    </Container>
  )
}

export default MultiFileDrop
