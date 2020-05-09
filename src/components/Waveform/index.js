import React, { useRef, useEffect } from "react"
import WavesurferJS from "wavesurfer.js"
import WavesurferRegions from "wavesurfer.js/dist/plugin/wavesurfer.regions.js"

export const Waveform = ({ onChange }) => {
  const waveformElm = useRef()
  const wavesurferObj = useRef()

  useEffect(() => {
    const wavesurfer = WavesurferJS.create({
      container: waveformElm.current,
      waveColor: "#A8DBA8",
      progressColor: "#3B8686",
      backend: "MediaElement",
      plugins: [
        WavesurferRegions.create({
          regions: [
            {
              start: 1,
              end: 3,
              loop: false,
              color: "hsla(400, 100%, 30%, 0.5)",
            },
            {
              start: 5,
              end: 7,
              loop: false,
              color: "hsla(200, 50%, 70%, 0.4)",
            },
          ],
          dragSelection: {
            slop: 5,
          },
        }),
      ],
    })
    wavesurfer.load(
      "https://s3.amazonaws.com/datasets.workaround.online/voice-samples/001/voice.mp3"
    )

    const sendUpdate = () => onChange(wavesurferObj.current.regions.list)

    wavesurfer.on("region-updated", sendUpdate)
    wavesurfer.on("region-created", sendUpdate)
    wavesurfer.on("region-removed", sendUpdate)
    wavesurfer.on("region-click", sendUpdate)

    wavesurferObj.current = wavesurfer
  }, [onChange])

  return (
    <div>
      <div ref={waveformElm}></div>
    </div>
  )
}

export default Waveform
