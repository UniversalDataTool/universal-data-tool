import React, { useState, useEffect, useRef } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import useElectron from "../../utils/use-electron"
import path from "path"
import ProgressBar from "../ProgressBar"
import Select from "react-select"
import downloadYoutubeVideo from "./download-youtube-video"

const ProgressContainer = styled("div")({
})
const ProgressText = styled("div")({
  whiteSpace: "pre-wrap"
})

const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300,
})

const SelectVideoQualityHeader = styled("h3")({
  lineHeight: 0,
  textAlign: "center"
})

const SelectVideoQuality = styled("div")({
  width: "100%",
  marginBottom: 8,
  paddingBottom: 4
})

const ErrorText = styled("pre")({
  whiteSpace: "pre-wrap",
  color: "#f00"
})

const TotalPercentageWrapper = styled("div")({
  flexDirection: "row",
  justifyContent: "space-between",
})


const CompletedVideoTitle = styled("h3")({
  textDecoration: "line-through"  
})

const qualityOptions = [
  { value: "lowest", label: "Lowest" },
  { value: "highest", label: "Highest" },
  { value: "highestaudio", label: "Highest Audio Only"},
  { value: "lowestaudio", label: "Lowest Audio Only" },
  { value: "lowestvideo", label: "Lowest Video Only" },
  { value: "highestvideo", label: "Highest Video Only" },
]

const splitURLsFromTextArea = (stringURLs) =>{
  const urlsHasHTTPS = []
  const splittedURLsByNewLines = stringURLs.split("\n")
  for (const url of splittedURLsByNewLines) {
    if (url.includes("https://")) {
      urlsHasHTTPS.push(url)
    }
  }
  return urlsHasHTTPS
}


const getYoutubeVideoInformation = async (remote, splittedURLsArray, progressCallback = () => null) =>{
  const ytdl = remote.require("ytdl-core")
    const checkedVideos = []
    if(splittedURLsArray.length > 0){
        for(let i = 0;i < splittedURLsArray.length; i++){
          const url = splittedURLsArray[i]
            const video = await new Promise((resolve, reject) =>{
                ytdl.getBasicInfo(url, (err, info) =>{
                    if(info && !err){
                        resolve({
                            url,
                            title: info.title,
                        })
                    }else{
                        const errorText = `Error with video at "${url}"\n\n${err.toString()}`
                        reject(new Error(errorText))
                    }
                })
            })
            checkedVideos.push(video)
            progressCallback({progress: i / (splittedURLsArray.length - 1) * 100, text: "Inspecting Video Information..." })
        }
    }
    return checkedVideos
}

const Progress = ({ unitProgress, overallProgress, completedVideoTitles }) =>{
  return(
    <ProgressContainer>
      <ProgressBar progress={overallProgress} />
      <ProgressBar progress={unitProgress.progress} />
      
      <h3>{unitProgress.title}</h3>
      <ProgressText>{unitProgress.progressText}</ProgressText>
      {(completedVideoTitles && completedVideoTitles.length > 0) ? completedVideoTitles : null}
    </ProgressContainer>
  )
}

const ImportFromYoutubeUrls = ({ open, onClose, onAddSamples }) => {
  const { remote } = useElectron() || {}
  
  const [urlsFromTextArea, setUrlsFromTextArea] = useState([])
  const [videoQuality, setVideoQuality] = useState("lowest")
  const [downloadPath, setDownloadPath] = useState(null)
  const [error, setError] = useState(null)
  
  const [unitProgress, setUnitProgress] = useState({ progress: 0, title: "" })
  const [overallProgress, setOverallProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [completedVideoTitles, setCompletedVideoTitles] = useState(null)
  
  const cancelRef = useRef()
  
  const setDefaultState = async () =>{
    setUnitProgress({ progress: 0, title: "" })
    setOverallProgress(0)
    setIsDownloading(false)
  }
  
  const closeDialog = async () =>{
    await setDefaultState()
    onClose()
  }
  
  return (
    <SimpleDialog
      open={open}
      onClose={closeDialog}
      title="Import from Youtube URLs"
      actions={[
        {
          text: "Cancel Downloads",
          disabled: !isDownloading,
          onClick: () => {
            cancelRef.current()
            setIsDownloading(false)
          }
        },
        {
          text: "Download Youtube URLs",
          onClick: async () => {
            setIsDownloading(true)
            const { canceled, filePaths } = await remote.dialog.showOpenDialog({
              title: "Directory to download files to",
              buttonLabel: "Download Files Here",
              properties: ["createDirectory", "openDirectory", "promptToCreate"],
            })
            
            if (canceled || !filePaths) return setIsDownloading(false)
        
            const downloadPath = filePaths[0]
            setDownloadPath(downloadPath)
            
            
            const youtubeVideoInfos = await getYoutubeVideoInformation(remote, urlsFromTextArea, ({progress, text}) => {
              setUnitProgress({ progress, title: text })
            }).catch(errorMessage => {
              console.error(errorMessage.stack)
              setError(errorMessage.toString())
              return null
            })
            if (!youtubeVideoInfos) return setIsDownloading(false)
            
            const completedVideoPaths = []
            const completedVideoTitlesArray = []
            
            const youtubeVideosCount = youtubeVideoInfos.length
            
            for (let i = 0; i < youtubeVideosCount; i++) {
              const youtubeVideoInfo = youtubeVideoInfos[i]
              const videoPath = await new Promise((resolve, reject) => {
                const { cancel } = downloadYoutubeVideo({
                  remote,
                  downloadPath,
                  youtubeUrl: youtubeVideoInfo.url,
                  title: youtubeVideoInfo.title,
                  videoQuality,
                  onProgress: ({ progress, text }) => setUnitProgress({ progress, title: youtubeVideoInfo.title, progressText: text }),
                  onComplete: filePath => resolve(filePath)
                })
                cancelRef.current = cancel
              })
              
              console.log(i)
              completedVideoTitlesArray.push(<CompletedVideoTitle key={i}>{youtubeVideoInfo.title}</CompletedVideoTitle>)
              setCompletedVideoTitles(completedVideoTitlesArray)
              
              completedVideoPaths.push(videoPath)
              
              setOverallProgress( i / (youtubeVideoInfos.length -1) * 100)
            }
            
            onAddSamples(completedVideoPaths.map(videoPath => ({
              videoUrl: `file://${videoPath}`
            })))
            
            setIsDownloading(false)
            
          },
          disabled: isDownloading,
        },
      ]}
    >
      {error && <ErrorText>{error}</ErrorText>}
      {isDownloading && <Progress unitProgress={unitProgress} completedVideoTitles={completedVideoTitles} overallProgress={overallProgress} />}
      {!isDownloading &&
        <React.Fragment>
          <SelectVideoQuality>
            <SelectVideoQualityHeader>Select Video Quality</SelectVideoQualityHeader>
            <Select defaultValue={qualityOptions[0]} options={qualityOptions} onChange={({value}) => setVideoQuality(value)} />
          </SelectVideoQuality>
          <TextArea
            onChange={(e, v) => {
              setUrlsFromTextArea(splitURLsFromTextArea(e.target.value))
            }}
            placeholder={"Paste Youtube URLs here\nOne URL per line"}
          />
        </React.Fragment>
      }
    </SimpleDialog>
  )
}


export default ImportFromYoutubeUrls