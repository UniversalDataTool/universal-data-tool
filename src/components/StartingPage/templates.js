// @flow
import React from "react"
import ImageSearch from "@material-ui/icons/ImageSearch"
import Image from "@material-ui/icons/Image"
import CropFree from "@material-ui/icons/CropFree"
import TextFormat from "@material-ui/icons/TextFormat"
import Edit from "@material-ui/icons/Edit"
import Audiotrack from "@material-ui/icons/Audiotrack"
import Category from "@material-ui/icons/Category"
import ThreeDRotation from "@material-ui/icons/ThreeDRotation"
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo"
import ContactSupport from "@material-ui/icons/ContactSupport"
import LowPriority from "@material-ui/icons/LowPriority"
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew"
import TimelineIcon from "@material-ui/icons/Timeline"

export const templates = [
  {
    name: "Empty",
    Icon: CropFree,
    dataset: {
      interface: {},
      samples: [],
    },
  },
  {
    name: "Image Segmentation",
    Icon: ImageSearch,
    dataset: {
      interface: {
        type: "image_segmentation",
        labels: ["valid", "invalid"],
        regionTypesAllowed: [
          "bounding-box",
          "polygon",
          // "full-segmentation",
          "point",
          "ordered-point",
          // "pixel-mask"
        ],
      },
      samples: [
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
        },
      ],
    },
  },
  {
    name: "Image Classification",
    Icon: Image,
    dataset: {
      interface: {
        type: "image_classification",
        labels: ["valid", "invalid"],
      },
      samples: [
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
        },
      ],
    },
  },
  {
    name: "Video Segmentation",
    Icon: OndemandVideoIcon,
    dataset: {
      interface: {
        type: "video_segmentation",
        labels: ["valid", "invalid"],
        regionTypesAllowed: [
          "bounding-box",
          "polygon",
          "point",
          "ordered-point",
        ],
      },
      samples: [
        {
          videoUrl:
            "https://s3.amazonaws.com/asset.workaround.online/SampleVideo_1280x720_1mb.mp4",
        },
      ],
    },
  },
  {
    name: "Data Entry",
    Icon: Edit,
    dataset: {
      interface: {
        type: "data_entry",
        description: "# Markdown description here",
        surveyjs: {
          questions: [
            {
              type: "text",
              name: "document_title",
              title: "Title of Document",
            },
          ],
        },
      },
      samples: [
        {
          pdfUrl: "https://arxiv.org/pdf/1906.01969.pdf",
        },
        {
          pdfUrl: "https://arxiv.org/pdf/1908.07069.pdf",
        },
      ],
    },
  },
  {
    name: "Named Entity Recognition",
    Icon: TextFormat,
    dataset: {
      interface: {
        type: "text_entity_recognition",
        overlapAllowed: false,
        labels: [
          {
            id: "food",
            displayName: "Food",
            description: "Edible item.",
          },
          {
            id: "hat",
            displayName: "Hat",
            description: "Something worn on the head.",
          },
        ],
      },
      samples: [
        {
          document:
            "This strainer makes a great hat, I'll wear it while I serve spaghetti!",
        },
        {
          document: "Why are all these dumpings covered in butter?!",
        },
      ],
    },
  },
  {
    name: "Text Entity Relations",
    Icon: ({ ...props }) => (
      <LowPriority
        {...props}
        style={{ ...props.style, transform: "rotate(90deg)" }}
      />
    ),
    dataset: {
      interface: {
        type: "text_entity_relations",
        entityLabels: [
          {
            id: "food",
            displayName: "Food",
            description: "Edible item.",
          },
          {
            id: "hat",
            displayName: "Hat",
            description: "Something worn on the head.",
          },
        ],
        relationLabels: [
          {
            id: "subject",
            displayName: "Subject",
          },
        ],
      },
      samples: [
        {
          document:
            "This strainer makes a great hat, I'll wear it while I serve spaghetti!",
        },
        {
          document: "Why are all these dumpings covered in butter?!",
        },
      ],
    },
  },
  {
    name: "Text Classification",
    Icon: ContactSupport,
    dataset: {
      interface: {
        type: "text_classification",
        labels: ["positive_sentiment", "negative_sentiment"],
      },
      samples: [
        {
          document: "Wow this is terrible. I hated it.",
        },
        {
          document: "This has made me so happy. I love this.",
        },
        {
          document:
            "At first I wasn't sure. Then I thought, oh it's not very good.",
        },
      ],
    },
  },
  {
    name: "Audio Transcription",
    Icon: Audiotrack,
    dataset: {
      interface: {
        type: "audio_transcription",
        description: "# Markdown description here",
      },
      samples: [
        {
          audioUrl: "https://html5tutorial.info/media/vincent.mp3",
        },
      ],
    },
  },
  {
    name: "Composite",
    Icon: Category,
    dataset: {
      description: "# Markdown description here",
      interface: {
        type: "composite",
        fields: [
          {
            fieldName: "textInfo",
            interface: {
              type: "data_entry",
              surveyjs: {
                questions: [
                  {
                    type: "text",
                    name: "group_letter",
                    title: "Letter of Group",
                  },
                ],
              },
            },
          },
          {
            fieldName: "segmentation",
            interface: {
              type: "image_segmentation",
              labels: ["group text"],
              regionTypesAllowed: ["bounding-box"],
            },
          },
        ],
      },
      samples: [
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
        },
      ],
    },
  },
  {
    name: "Pixel Segmentation",
    Icon: ImageSearch,
    dataset: {
      interface: {
        type: "image_pixel_segmentation",
        labels: ["hair", "mouth", "nose", "eyes"],
        description: "These are AI-generated faces, not real people.",
      },
      samples: [
        {
          imageUrl:
            "https://s3.amazonaws.com/datasets.workaround.online/faces/010041.jpg",
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/datasets.workaround.online/faces/010026.jpg",
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/datasets.workaround.online/faces/010025.jpg",
        },
      ],
    },
  },
  {
    name: "Image Landmark Annotation",
    Icon: AccessibilityNewIcon,
    dataset: {
      interface: {
        type: "image_landmark_annotation",
        keypointDefinitions: {
          human: {
            landmarks: {
              nose: {
                label: "Nose",
                color: "#f00",
                defaultPosition: [0, 0],
              },
              leftEye: {
                label: "Left Eye",
                color: "#00f",
                defaultPosition: [-0.05, -0.05],
              },
              leftEar: {
                label: "Left Ear",
                color: "#0ff",
                defaultPosition: [-0.1, -0.05],
              },
              rightEye: {
                label: "Left Eye",
                color: "#f0f",
                defaultPosition: [0.05, -0.05],
              },
              rightEar: {
                label: "Left Ear",
                color: "#00f",
                defaultPosition: [0.1, -0.05],
              },
              sternum: {
                label: "Sternum",
                color: "#0f0",
                defaultPosition: [0, 0.1],
              },
              leftShoulder: {
                label: "Left Shoulder",
                color: "#0ff",
                defaultPosition: [-0.2, 0.1],
              },
              rightShoulder: {
                label: "Right Shoulder",
                color: "#00f",
                defaultPosition: [0.2, 0.1],
              },
              leftElbow: {
                label: "Left Elbow",
                color: "#0f0",
                defaultPosition: [-0.2, 0.2],
              },
              rightElbow: {
                label: "Right Elbow",
                color: "#f00",
                defaultPosition: [0.2, 0.2],
              },
              leftHand: {
                label: "Left Hand",
                color: "#00f",
                defaultPosition: [-0.2, 0.3],
              },
              rightHand: {
                label: "Right Hand",
                color: "#f0f",
                defaultPosition: [0.2, 0.3],
              },
              leftThigh: {
                label: "Left Thigh",
                color: "#f00",
                defaultPosition: [-0.1, 0.35],
              },
              rightThigh: {
                label: "Right Thigh",
                color: "#0ff",
                defaultPosition: [0.1, 0.35],
              },
              leftKnee: {
                label: "Left Thigh",
                color: "#ff0",
                defaultPosition: [-0.15, 0.45],
              },
              rightKnee: {
                label: "Right Thigh",
                color: "#0f0",
                defaultPosition: [0.15, 0.45],
              },
              leftFoot: {
                label: "Left Foot",
                color: "#00f",
                defaultPosition: [-0.15, 0.55],
              },
              rightFoot: {
                label: "Right Foot",
                color: "#f00",
                defaultPosition: [0.15, 0.55],
              },
            },
            connections: [
              ["sternum", "nose"],
              ["nose", "leftEye"],
              ["leftEye", "leftEar"],
              ["nose", "rightEye"],
              ["rightEye", "rightEar"],
              ["sternum", "leftShoulder"],
              ["leftShoulder", "leftElbow"],
              ["leftElbow", "leftHand"],
              ["sternum", "leftThigh"],
              ["leftThigh", "leftKnee"],
              ["leftKnee", "leftFoot"],
              ["sternum", "rightShoulder"],
              ["rightShoulder", "rightElbow"],
              ["rightElbow", "rightHand"],
              ["sternum", "rightThigh"],
              ["rightThigh", "rightKnee"],
              ["rightKnee", "rightFoot"],
            ],
          },
        },
      },
      samples: [
        {
          imageUrl:
            "https://media.istockphoto.com/photos/businesswoman-picture-id918002786",
        },
      ],
    },
  },
  {
    name: "Time Series",
    Icon: TimelineIcon,
    dataset: {
      interface: {
        type: "time_series",
        timeFormat: "dates",
        enabledTools: ["create-durations", "label-durations"],
        durationLabels: ["@seveibar is speaking"],
      },
      samples: [
        {
          // timeData: [
          //   { time: 0, value: 0 },
          //   { time: 500, value: 0.75 },
          //   { time: 1000, value: 1 },
          // ],
          audioUrl:
            "https://s3.amazonaws.com/datasets.workaround.online/voice-samples/001/voice.mp3",
          annotation: {
            durations: [
              { start: 500, end: 2000, label: "@seveibar is speaking" },
            ],
          },
        },
      ],
    },
  },
  {
    name: "Time Series 2",
    Icon: TimelineIcon,
    dataset: {
      interface: {
        type: "time_series",
        timeFormat: "dates",
        enabledTools: ["create-durations", "label-durations"],
        durationLabels: ["@seveibar is speaking"],
      },
      samples: [
        {
          timeData: [
            { time: 0, value: 0 },
            { time: 500, value: 0.75 },
            { time: 1000, value: 1 },
          ],
          annotation: {
            durations: [
              { start: 500, end: 2000, label: "@seveibar is speaking" },
            ],
          },
        },
      ],
    },
  },
  {
    name: "3D Bounding Box",
    Icon: ThreeDRotation,
    dataset: {
      interface: {
        type: "3d_bounding_box",
        description: "3D Bounding Box",
      },
      samples: [{}],
    },
  },
]

export const templateMap = templates.reduce((acc, t) => {
  acc[t.name] = t
  acc[t.dataset.interface.type] = t
  return acc
}, {})

export default templates
