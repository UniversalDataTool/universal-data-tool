import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ImageSegmentation from "./";
storiesOf("ImageSegmentation", module).add("Basic", function () {
  return React.createElement(ImageSegmentation, Object.assign({
    onSaveTaskOutputItem: action("onSaveTaskOutputItem")
  }, {
    interface: {
      type: "image_segmentation",
      availableLabels: ["valid", "invalid"],
      regionTypesAllowed: ["bounding-box", "polygon", "full-segmentation", "point", "pixel-mask"]
    },
    taskData: [{
      imageUrl: "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg"
    }, {
      imageUrl: "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
    }]
  }));
});