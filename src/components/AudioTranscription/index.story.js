// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import AudioTranscription from "./"

storiesOf("AudioTranscription", module).add("Basic", () => (
  <AudioTranscription
    onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
    interface={{
      type: "audio_transcription",
      description: "This is an **audio transcription** description.",
    }}
    sample={{
      audioUrl: "https://html5tutorial.info/media/vincent.mp3",
      annotation: "starry starry night",
    }}
  />
))
