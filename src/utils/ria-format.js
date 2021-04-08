// @flow

// RIA = React Image Annotate

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomColor() {
  var h = getRandomInt(0, 360)
  var s = 100
  var l = 50
  return "hsl("
    .concat(h.toString(), ",")
    .concat(s.toString(), "%,")
    .concat(l.toString(), "%)")
}

export const rid = () => Math.random().toString().split(".")[1]

export const convertToRIARegionFmt = (region) => {
  switch (region.regionType) {
    case "bounding-box": {
      return {
        id: region.id || rid(),
        cls: region.classification,
        tags: region.labels,
        color: region.color || getRandomColor(),
        type: "box",
        x: region.centerX - region.width / 2,
        y: region.centerY - region.height / 2,
        w: region.width,
        h: region.height,
      }
    }
    case "ordered-point":
    case "point": {
      return {
        id: region.id || rid(),
        type: "point",
        tags: region.labels,
        cls: region.classification,
        color: region.color || getRandomColor(),
        x: region.x,
        y: region.y,
      }
    }
    case "polygon": {
      return {
        id: region.id || rid(),
        type: "polygon",
        tags: region.labels,
        cls: region.classification,
        color: region.color || getRandomColor(),
        open: false,
        points: region.points.map((p) => [p.x, p.y]),
      }
    }
    case "line":
    case "pixel-mask": {
      throw new Error(`Unsupported region "${JSON.stringify(region)}"`)
    }
    case "keypoints": {
      return {
        id: region.id || rid(),
        type: "keypoints",
        keypointsDefinitionId: region.keypointsDefinitionId,
        points: region.points,
      }
    }
    default:
      return null
  }
}

export const convertFromRIARegionFmt = (riaRegion) => {
  switch (riaRegion.type) {
    case "ordered-point":
    case "point": {
      return {
        regionType: "point",
        id: riaRegion.id,
        x: riaRegion.x,
        y: riaRegion.y,
        classification: riaRegion.cls,
        labels: riaRegion.tags,
        color: riaRegion.color,
      }
    }
    case "box": {
      return {
        regionType: "bounding-box",
        id: riaRegion.id,
        centerX: riaRegion.x + riaRegion.w / 2,
        centerY: riaRegion.y + riaRegion.h / 2,
        width: riaRegion.w,
        height: riaRegion.h,
        classification: riaRegion.cls,
        labels: riaRegion.tags,
        color: riaRegion.color,
      }
    }
    case "polygon": {
      return {
        regionType: "polygon",
        id: riaRegion.id,
        classification: riaRegion.cls,
        labels: riaRegion.tags,
        color: riaRegion.color,
        points: riaRegion.points.map(([x, y]) => ({ x, y })),
      }
    }
    case "keypoints": {
      return {
        id: riaRegion.id || rid(),
        keypointsDefinitionId: riaRegion.keypointsDefinitionId,
        regionType: "keypoints",
        points: riaRegion.points,
      }
    }
    default:
      throw new Error(`Unsupported riaRegion "${JSON.stringify(riaRegion)}"`)
  }
}

export const convertToRIAImageFmt = ({
  title,
  taskDatum: td,
  index: i,
  output,
}) => {
  td = td || {}
  const regions = !output
    ? undefined
    : Array.isArray(output)
    ? output.map(convertToRIARegionFmt)
    : [convertToRIARegionFmt(output)]

  if (td.imageUrl) {
    return {
      src: td.imageUrl,
      name: title || `Sample ${i}`,
      regions,
    }
  } else if (td.videoUrl && td.videoFrameAt !== undefined) {
    return {
      src: td.videoUrl,
      frameTime: td.videoFrameAt,
      name: title || `Sample ${i}`,
      regions,
    }
  }
  throw new Error(`Task Datum not supported "${JSON.stringify(td)}"`)
}

export const convertToRIAKeyframes = (keyframes) => {
  const newKeyframes = {}
  for (const key in keyframes) {
    newKeyframes[key] = {
      regions: keyframes[key].regions.map(convertToRIARegionFmt),
    }
  }
  return newKeyframes
}
