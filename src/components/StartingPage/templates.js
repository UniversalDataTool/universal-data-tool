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

export default [
  {
    name: "Empty",
    Icon: CropFree,
    oha: {
      interface: {},
      taskData: []
    }
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
          "point"
          // "pixel-mask"
        ]
      },
      taskData: [
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg"
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
        }
      ]
    }
  },
  {
    name: "Image Classification",
    Icon: Image,
    oha: {
      interface: {
        type: "image_classification",
        availableLabels: ["valid", "invalid"]
      },
      taskData: [
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg"
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
        }
      ]
    }
  },
  {
    name: "Video Segmentation",
    Icon: OndemandVideoIcon,
    oha: {
      interface: {
        type: "video_segmentation",
        availableLabels: ["valid", "invalid"],
        regionTypesAllowed: ["bounding-box", "polygon", "point"]
      },
      taskData: [
        {
          videoUrl:
            "https://s3.amazonaws.com/asset.workaround.online/SampleVideo_1280x720_1mb.mp4"
        }
      ]
    }
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
              title: "Title of Document"
            }
          ]
        }
      },
      taskData: [
        {
          pdfUrl: "https://arxiv.org/pdf/1906.01969.pdf"
        },
        {
          pdfUrl: "https://arxiv.org/pdf/1908.07069.pdf"
        }
      ]
    }
  },
  {
    name: "Natural Language",
    Icon: TextFormat,
    oha: {
      interface: {
        type: "text_entity_recognition",
        overlapAllowed: false,
        labels: [
          {
            id: "food",
            displayName: "Food",
            description: "Edible item."
          },
          {
            id: "hat",
            displayName: "Hat",
            description: "Something worn on the head."
          }
        ]
      },
      taskData: [
        {
          document:
            "This strainer makes a great hat, I'll wear it while I serve spaghetti!"
        }
      ]
    }
  },
  {
    name: "Audio Transcription",
    Icon: Audiotrack,
    oha: {
      interface: {
        type: "audio_transcription",
        description: "# Markdown description here"
      },
      taskData: [
        {
          audioUrl: "https://html5tutorial.info/media/vincent.mp3"
        }
      ]
    }
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
                    title: "Letter of Group"
                  }
                ]
              }
            }
          },
          {
            fieldName: "segmentation",
            interface: {
              type: "image_segmentation",
              availableLabels: ["group text"],
              regionTypesAllowed: ["bounding-box"]
            }
          }
        ]
      },
      taskData: [
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg"
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
        }
      ]
    }
  },
  {
    name: "3D Bounding Box",
    Icon: ThreeDRotation,
    oha: {
      interface: {
        type: "3d_bounding_box",
        description: "3D Bounding Box"
      }
    }
  }
]
