// @flow

import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import Container from "./"

storiesOf("WorkspaceContainer", module).add("Basic", () => (
  <Container
    onNext={action("onNext")}
    onPrev={action("onPrev")}
    onClickHeaderItem={action("onClickHeaderItem")}
  >
    Some inner content
  </Container>
))
