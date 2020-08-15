import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import BucketIcon from "../ImportPage/S3Icon"
import DirectoryIcon from "@material-ui/icons/FolderOpen"
import FileIcon from "@material-ui/icons/InsertDriveFile"
import BackIcon from "@material-ui/icons/KeyboardArrowUp"
import IconButton from "@material-ui/core/IconButton"

const Container = styled(Box)({})
const Items = styled(Box)({ height: 300, width: 400, overflowY: "scroll" })
const Path = styled(Box)({
  fontWeight: "bold",
  color: colors.grey[600],
})
const Item = styled(Button)({ width: "100%" })

export const S3BucketSelector = ({
  currentPath,
  options,
  canCreateNew,
  onChangePath,
  showFiles = true,
}) => {
  return (
    <Container>
      <Path display="flex" alignItems="center">
        <IconButton
          disabled={!currentPath}
          onClick={() => {
            const newPath = currentPath.split("/").slice(0, -2).join("/") + "/"
            if (newPath === "s3://") {
              onChangePath("")
            } else {
              onChangePath(newPath)
            }
          }}
        >
          <BackIcon />
        </IconButton>
        <Box>{currentPath}</Box>
      </Path>
      <Items>
        {options
          .filter((option) => (option.type === "file" ? showFiles : true))
          .map((option, i) => (
            <Item
              key={i}
              onClick={() => {
                if (option.type === "file") {
                  onChangePath(currentPath + option.name)
                } else {
                  if (!currentPath) {
                    onChangePath(`s3://${option.name}/`)
                  } else {
                    onChangePath(`${currentPath}${option.name}`)
                  }
                }
              }}
            >
              {option.type === "bucket" ? (
                <BucketIcon className="icon" />
              ) : option.type === "directory" ? (
                <DirectoryIcon className="icon" />
              ) : (
                <FileIcon className="icon" />
              )}
              <Box
                flexGrow={1}
                className="text"
                textAlign="left"
                paddingLeft={1}
              >
                {option.name}
              </Box>
            </Item>
          ))}
        {currentPath !== "" && canCreateNew && (
          <Item
            key="create-new"
            onClick={() => {
              // TODO switch to MUI dialog
              const newDirectory = window.prompt(
                "Enter the name of new directory"
              )
              if (newDirectory) {
                onChangePath(currentPath + newDirectory + "/")
              }
            }}
          >
            <DirectoryIcon className="icon" />
            <Box flexGrow={1} className="text" textAlign="left" paddingLeft={1}>
              Create New
            </Box>
          </Item>
        )}
      </Items>
    </Container>
  )
}

export default S3BucketSelector
