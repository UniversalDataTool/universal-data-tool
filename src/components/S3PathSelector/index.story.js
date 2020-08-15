// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import S3PathSelector from "./"

storiesOf("S3PathSelector", module)
  .add("Select Bucket", () => (
    <S3PathSelector
      currentPath=""
      options={[
        { type: "bucket", name: "bucket1" },
        { type: "bucket", name: "bucket2" },
      ]}
      onChangePath={action("onChangePath")}
    />
  ))
  .add("Select Directory", () => (
    <S3PathSelector
      currentPath="s3://bucket/"
      options={[
        {
          type: "directory",
          name: "directory1",
        },
        {
          type: "directory",
          name: "directory2",
        },
        { type: "file", name: "file1.png" },
      ]}
      onChangePath={action("onChangePath")}
    />
  ))
