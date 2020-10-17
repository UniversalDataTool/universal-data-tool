// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImageLandmarkAnnotation from "./"

storiesOf("ImageLandmarkAnnotation", module).add("Basic", () => (
  <ImageLandmarkAnnotation
    onModifySample={action("onModifySample")}
    {...{
      interface: {
        type: "image_landmark_annotation",

        // Different configurations of poses / keypoints
        keypointDefinitions: {
          // This is a pose definition for the upper half of a human
          human: {
            // Each landmark is a point on the pose.
            landmarks: {
              head: {
                label: "Head",
                color: "#f00",
                // The default position is the position relative to the cursor
                // in [image_width%, image_height%] to place this point at when
                // a pose is created
                defaultPosition: [0, -0.05],
              },
              sternum: {
                label: "Torso",
                color: "#0f0",
                defaultPosition: [0, 0],
              },
              leftElbow: {
                label: "Left Elbow",
                color: "#00f",
                defaultPosition: [-0.05, 0],
              },
              rightElbow: {
                label: "Right Elbow",
                color: "#00f",
                defaultPosition: [0.05, 0],
              },
            },

            // The connections will determine what lines are drawn between points, they
            // are only aesthetic
            connections: [
              ["head", "sternum"],
              ["sternum", "leftElbow"],
              ["sternum", "rightElbow"],
            ],
          },
        },
      },
      sample: {
        // URL pointing to image
        imageUrl:
          "https://media.gettyimages.com/photos/dog-and-cat-picture-id151350785",
        annotation: {
          regionType: "keypoints",
          keypointsDefinitionId: "human",
          points: {
            head: { x: 0.54, y: 0.2 },
            sternum: { x: 0.57, y: 0.3 },
            // when "obscured" is set to true, it means something is blocking or obstructing the visibility of this keypoint in the image
            leftElbow: { x: 0.4, y: 0.39, obscured: true },
            rightElbow: { x: 0.7, y: 0.32 },
          },
        },
      },
    }}
  />
))
