// @flow

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

export const templates = [
  {
    name: "Empty",
    Icon: CropFree,
    oha: {
      interface: {},
      samples: [],
    },
  },
  {
    name: "Image Segmentation",
    Icon: ImageSearch,
    oha: {
      interface: {
        type: "image_segmentation",
        availableLabels: ["valid", "invalid"],
        regionTypesAllowed: [
          "bounding-box",
          "polygon",
          // "full-segmentation",
          "point",
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
    oha: {
      interface: {
        type: "image_classification",
        availableLabels: ["valid", "invalid"],
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
    oha: {
      interface: {
        type: "video_segmentation",
        availableLabels: ["valid", "invalid"],
        regionTypesAllowed: ["bounding-box", "polygon", "point"],
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
    oha: {
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
    oha: {
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
    name: "Text Classification",
    Icon: ContactSupport,
    oha: {
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
    oha: {
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
    oha: {
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
              availableLabels: ["group text"],
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
    name: "3D Bounding Box",
    Icon: ThreeDRotation,
    oha: {
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
  return acc
}, {})

export default templates
