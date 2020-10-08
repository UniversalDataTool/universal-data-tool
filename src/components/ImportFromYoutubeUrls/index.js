import React, { useState, useRef } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import useElectron from "../../hooks/use-electron"
import Select from "react-select"
import downloadYoutubeVideo from "./download-youtube-video"
import Progress from "./progress"
import getYoutubeVideoInformation from "./get-youtube-video-information"
import splitURLsFromTextArea from "./split-urls-from-text-area"
import { useTranslation } from "react-i18next"

const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300,
})

const SelectVideoQualityHeader = styled("h3")({
  lineHeight: 0,
  textAlign: "center",
})

const SelectVideoQuality = styled("div")({
  width: "100%",
  marginBottom: 8,
  paddingBottom: 4,
})

const ErrorText = styled("pre")({
  whiteSpace: "pre-wrap",
  color: "#f00",
})

const LoadingText = styled("h2")({
  width: "100%",
  height: "100%",
  margin: "auto auto",
  textAlign: "center",
})

const CompletedVideoTitle = styled("h3")({
  textDecoration: "line-through",
  lineHeight: 0,
})

const qualityOptions = [
  { value: "136", label: "720p" },
  { value: "135", label: "480p" },
  { value: "lowestvideo", label: "Lowest Video Only" },
  // TODO these did not seem to work in a local test (missing video)
  // { value: "lowest", label: "lowest" },
  // { value: "highest", label: "Highest" },
  { value: "highestvideo", label: "Highest Video Only" },
  { value: "lowestaudio", label: "Lowest Audio Only" },
  { value: "highestaudio", label: "Highest Audio Only" },
]

const ImportFromYoutubeUrls = ({ open, onClose, onAddSamples }) => {
  const { remote } = useElectron() || {}
  const { t } = useTranslation()

  const [urlsFromTextArea, setUrlsFromTextArea] = useState([])
  const [videoQuality, setVideoQuality] = useState(qualityOptions[0].value)
  const [error, setError] = useState(null)

  const [unitProgress, setUnitProgress] = useState({ progress: 0 })
  const [overallProgress, setOverallProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [completedVideoTitles, setCompletedVideoTitles] = useState(null)

  const cancelRef = useRef()

  const setDefaultState = async () => {
    setUnitProgress({ progress: 0, title: "" })
    setOverallProgress(0)
    setIsDownloading(false)
  }

  const closeDialog = async () => {
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
          },
        },
        {
          text: "Download Youtube URLs",
          onClick: async () => {
            setIsDownloading(true)
            const { canceled, filePaths } = await remote.dialog.showOpenDialog({
              title: "Directory to download files to",
              buttonLabel: "Download Files Here",
              properties: [
                "createDirectory",
                "openDirectory",
                "promptToCreate",
              ],
            })

            if (canceled || !filePaths) return setIsDownloading(false)

            const downloadPath = filePaths[0]

            const youtubeVideoInfos = await getYoutubeVideoInformation(
              remote,
              urlsFromTextArea,
              ({ progress, text }) => {
                setUnitProgress({ progress })
              }
            ).catch((errorMessage) => {
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
                  onChangeOverallProgress: (currentProgress) =>
                    setOverallProgress(
                      ((completedVideoTitlesArray.length * 100 +
                        currentProgress) /
                        (youtubeVideosCount * 100)) *
                        100
                    ),
                  onProgress: ({ progress, text }) =>
                    setUnitProgress({
                      progress,
                      title: youtubeVideoInfo.title,
                      progressText: text,
                    }),
                  onComplete: (filePath) => resolve(filePath),
                })
                cancelRef.current = cancel
              })

              completedVideoTitlesArray.push(
                <li key={i + youtubeVideoInfo.title}>
                  <CompletedVideoTitle>
                    {youtubeVideoInfo.title}
                  </CompletedVideoTitle>
                </li>
              )
              setCompletedVideoTitles(completedVideoTitlesArray)

              completedVideoPaths.push(videoPath)
            }

            onAddSamples(
              completedVideoPaths.map((videoPath) => ({
                videoUrl: `file://${videoPath}`,
              }))
            )

            setIsDownloading(false)
          },
          disabled: isDownloading,
        },
      ]}
    >
      {error && <ErrorText>{error}</ErrorText>}
      {isDownloading &&
      ((unitProgress && unitProgress.progress && unitProgress.progress > 0) ||
        (completedVideoTitles &&
          Array.isArray(completedVideoTitles) === true &&
          completedVideoTitles.length > 0)) ? (
        <Progress
          unitProgress={unitProgress}
          completedVideoTitles={completedVideoTitles}
          overallProgress={overallProgress}
        />
      ) : isDownloading === true ? (
        <LoadingText>Information is Loading</LoadingText>
      ) : null}
      {!isDownloading && (
        <React.Fragment>
          <SelectVideoQuality>
            <SelectVideoQualityHeader>
              {t("select-video-quality")}
            </SelectVideoQualityHeader>
            <Select
              defaultValue={qualityOptions[0]}
              options={qualityOptions}
              onChange={({ value }) => setVideoQuality(value)}
            />
          </SelectVideoQuality>
          <TextArea
            onChange={(e, v) => {
              setUrlsFromTextArea(splitURLsFromTextArea(e.target.value))
            }}
            placeholder={"Paste Youtube URLs here\nOne URL per line"}
          />
        </React.Fragment>
      )}
    </SimpleDialog>
  )
}

export default ImportFromYoutubeUrls
