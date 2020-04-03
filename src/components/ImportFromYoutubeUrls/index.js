import React, { useState, useEffect } from 'react';
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import * as ytdl from 'ytdl-core'
import useElectron from "../../utils/use-electron"
import path from "path"
import ProgressBar from "../ProgressBar"

const TextArea = styled("textarea")({
    width: "100%",
    minHeight: 300
})

const TotalPercentageWrapper = styled("div")({
    flexDirection: 'row',
    justifyContent: 'space-between',
})

// TODO: ADD Select Video Quality
const videoQualities = ["highest","lowest","highestaudio","lowestaudio","highestvideo","lowestvideo"]

/*
    *
    *   User opened modal with clicking "Import Youtube URLs"
    *   User paste youtube URLs
    *   When youtubeUrls changed split that URLs by the "\n"
    *   Take those splitted URLs in a new array
    *   User click "Download Youtube URLs"
    *   startDownload will true by the click
    *   User select download path
    *   Take that download path
    *   When download path is not null download starts
    * 
*/

const ImportFromYoutubeUrls = ({ open, onClose, onAddSamples }) => {
    const { remote } = useElectron() || {}
    const [youtubeURLsArray, setYoutubeURLsArray] = useState([])
    const [youtubeURLs, setYoutubeURLs] = useState("")
    const [downloadPath, setDownloadPath] = useState()
    const [startDownload, setStartDownload] = useState(false)
    const [currentVideo,setCurrentVideo] = useState(null)
    const [totalProgress, setTotalProgress] = useState(null)

    const splitURLs = () =>{
        const urlsHasHTTPS = []
        const splittedNewLines = youtubeURLs.split("\n")
        for(const splittedNewLine of splittedNewLines){
            if(splittedNewLine.includes("https://")){
                urlsHasHTTPS.push(splittedNewLine)
            }
        }
        const splittedURLs = urlsHasHTTPS
        return splittedURLs
    }

    const downloadYoutubeURL = (youtubeURL, videoTitle) =>{
        const currentPath = path.join(downloadPath, `${videoTitle+'.mp4'}`)
        const writable = remote.require("fs").createWriteStream(currentPath);
                
        //TODO: ADD selected video quality in that parameters object
        const videoWithOptions = ytdl(youtubeURL, {
            format: "video/mp4",
        })
        
        videoWithOptions.on('end', () =>{
            setCurrentVideo({
                title: null,
                finished: true,
                progressText: null,
                progressPercentage: null
            })
        })
        
        videoWithOptions.pipe(writable)

        let starttime;
        
        videoWithOptions.once('response', () => {
          starttime = Date.now();
        });

        videoWithOptions.on('progress', (chunkLength, downloaded, total) => {
            const percent = downloaded / total;
            const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;

            remote.require("readline").cursorTo(process.stdout, 0);
            remote.process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
            remote.process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
            remote.process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
            remote.process.stdout.write(`, estimated time left: ${(downloadedMinutes / percent - downloadedMinutes).toFixed(2)}minutes `);
            remote.require("readline").moveCursor(process.stdout, 0, -1)

            setCurrentVideo({
                youtubeURL,
                title: videoTitle,
                finished: false,
                progressText: `${(percent * 100).toFixed(2)}% downloaded (${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB), estimated time left: ${(downloadedMinutes / percent - downloadedMinutes).toFixed(2)}minutes`,
                progressPercentage: Number((percent * 100).toFixed(2))
            })
        });
    }

    const downloadYoutubeURLs = () =>{
        for(const youtubeURL of youtubeURLsArray){
            if(youtubeURL.startsWith('https://')){
                ytdl.getBasicInfo(youtubeURL, (err, info) =>{
                    const { title } = info
                    if(title){
                        downloadYoutubeURL(youtubeURL, title)
                    }
                })
            }
        }
    }

    const selectDownloadPath =  async () =>{
        const { canceled, filePaths } = await remote.dialog.showOpenDialog({
            title: "Directory to download files to",
            buttonLabel: "Download Files Here",
            properties: ["createDirectory", "openDirectory", "promptToCreate"]
        })
        
        if(canceled === false && filePaths){
            setDownloadPath(filePaths[0])
        }
    }

    useEffect(() =>{
        const splittedURLs = splitURLs()
        setYoutubeURLsArray(splittedURLs)
    },[youtubeURLs])

    useEffect(() =>{
        if(startDownload === true){
            selectDownloadPath()
        }
    },[startDownload])

    useEffect(() =>{
        if(downloadPath){
            downloadYoutubeURLs()
        }
    },[downloadPath])

    useEffect(() => {
        if(youtubeURLsArray.length > 0 && currentVideo !== null && currentVideo.youtubeURL !== null){
            let progressVariable = 0
            const currentObject = {...totalProgress}
            let currentTotalProgress = null
            const currentVideoIndex = youtubeURLsArray.indexOf(currentVideo.youtubeURL)
            if(totalProgress !== null && totalProgress.videos && totalProgress.videos.length > 0){
                currentTotalProgress = Object.values(totalProgress.videos).map((videoProgress => progressVariable = progressVariable+Number(videoProgress)))
                progressVariable = progressVariable/(100*(youtubeURLsArray.length))
                currentTotalProgress = progressVariable
                if(currentVideo.progressPercentage === 100){
                    currentObject["totalFinished"] = currentObject["totalFinished"] + 1
                }
            }else{
                const zeroFilledArray = new Array((youtubeURLsArray.length) - 1).fill(0);
                currentObject["videos"] = zeroFilledArray
                currentTotalProgress = (Number(currentVideo.progressPercentage)/(100*(youtubeURLsArray.length -1)))
                currentObject["totalFinished"] = 0
            }
            currentObject["videos"][currentVideoIndex] = Number(currentVideo.progressPercentage)
            currentObject["percentage"] = (currentTotalProgress*100)
            currentObject["totalLength"] = youtubeURLsArray.length

            setTotalProgress(currentObject)
        }
    },[currentVideo])

    const refreshState = () =>{
        setYoutubeURLs("")
        setDownloadPath(null)
        setStartDownload(false)
        setCurrentVideo(null)
        setTotalProgress(null)
    }

    const closed = () =>{
        onClose()
        refreshState()
    }

    return (
        <SimpleDialog
            open={open}
            onClose={closed}
            title="Import from Youtube URLs"
            actions={[
                {
                    text: "Download Youtube URLs",
                    onClick: () => setStartDownload(true) ,
                    disabled: currentVideo !== null ? true : false
                }
            ]}
        >
            <TextArea
                onChange={(e, v) => setYoutubeURLs(e.target.value)}
                placeholder={"Paste Youtube URLs here\nOne URL per line"}
                style={{
                    display: downloadPath ? 'none' : 'block'
                }}
            />
                        
        {/* =======================================* Current Percentage Start *======================================= */}
            {
                (downloadPath && currentVideo !== null && currentVideo.title) ? <h2>Downloading: {currentVideo.title}</h2> : null
            }
            {
                (downloadPath && currentVideo !== null && currentVideo.progressText) ? <h2>Progress: {currentVideo.progressText}</h2> : null
            }
            <div
                style={{
                    display: (currentVideo === null || currentVideo.progressPercentage === null || currentVideo.finished === true) ? 'none' : 'block'
                }}
            >
                <ProgressBar
                    progress={(downloadPath && currentVideo !== null && currentVideo.progressPercentage) ? currentVideo.progressPercentage : 0 }
                />
            </div>
        {/* =======================================* Current Percentage End *======================================= */}

        {/* =======================================* ********************** *======================================= */}
        
        {/* =======================================* Total Percentage Start *======================================= */}
            {
                (downloadPath && youtubeURLsArray.length > 0) ? <ProgressBar progress={(totalProgress !== null && totalProgress.percentage) ? totalProgress.percentage : 0} /> : null
            }
            <TotalPercentageWrapper
                style={{
                    display: (downloadPath && youtubeURLsArray.length > 0 && totalProgress !== null) ? 'flex' : 'none'
                }}
            >
                <h2>
                    Total Videos:{
                        (downloadPath && youtubeURLsArray.length > 0 && totalProgress !== null && totalProgress.totalLength ) ?  totalProgress.totalLength : null
                    }
                </h2>
                <h2>
                    Finished:{
                        (downloadPath && youtubeURLsArray.length > 0 && totalProgress !== null ) ?  totalProgress.totalFinished : null
                    }
                </h2>
            </TotalPercentageWrapper>
        {/* =======================================* Total Percentage End *======================================= */}
        </SimpleDialog>
    );
}

export default ImportFromYoutubeUrls;
