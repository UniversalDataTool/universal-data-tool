// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import SampleContainer from "./"

storiesOf("SampleContainer", module)
  .add("Basic", () => (
    <SampleContainer
      currentSampleIndex={0}
      totalSamples={10}
      onChangeSample={action("onChangeSample")}
      description={`
## Complete the task on the right

Or just view the content.

      `.trim()}
    >
      This is where the task data and interface goes.
    </SampleContainer>
  ))
  .add("Hide Title", () => (
    <SampleContainer
      currentSampleIndex={0}
      totalSamples={10}
      hideHeader
      onChangeSample={action("onChangeSample")}
      description={`
## Complete the task on the right

Or just view the content.

      `.trim()}
    >
      This is where the task data and interface goes.
    </SampleContainer>
  ))
  .add("Hide Description", () => (
    <SampleContainer
      currentSampleIndex={0}
      totalSamples={10}
      hideDescription
      onChangeSample={action("onChangeSample")}
      description={`
## Complete the task on the right

Or just view the content.

      `.trim()}
    >
      This is where the task data and interface goes.
    </SampleContainer>
  ))
