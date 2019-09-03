// @flow

import RemoveRedEye from "@material-ui/icons/RemoveRedEye"
import TextFormat from "@material-ui/icons/TextFormat"
import Edit from "@material-ui/icons/Edit"

export default [
  {
    name: "Computer Vision",
    Icon: RemoveRedEye,
    oha: {
      interface: {
        type: "image_segmentation",
        availableLabels: ["valid", "invalid"],
        regionTypesAllowed: [
          "bounding-box",
          "polygon",
          "full-segmentation",
          "point",
          "pixel-mask"
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
  }
]
