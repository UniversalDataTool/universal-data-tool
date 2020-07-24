// @flow weak

import seed from "seed-random"
import * as colors from "@material-ui/core/colors"

const fade = (cmap, amt) => {
  const newCmap = {}
  for (let i = 100; i < 1000; i++) {
    if (i - amt <= 0) {
      newCmap[i] = "#fff"
    } else {
      newCmap[i] = cmap[i - amt]
    }
  }
  return newCmap
}

const fadedGrey = {
  ...colors.grey,
  // "800": colors.grey[600],
  // "700": colors.grey[500],
  // "600": colors.grey[400],
  // "500": colors.grey[300],
  // "400": colors.grey[200],
  // "300": colors.grey[100],
  isFaded: true,
}

const availableColors = [
  colors.blue,
  colors.deepOrange,
  colors.green,
  colors.purple,
  colors.pink,
  colors.cyan,
  colors.orange,
  colors.indigo,
]

const colorMap = {
  ...colors,
  complete: colors.blue,
  incomplete: fadedGrey,
  faded: fadedGrey,
  review: colors.deepOrange,
  ellipsis1: fade(colors.grey, 100),
  ellipsis2: fade(colors.grey, 200),
  ellipsis3: fade(colors.grey, 300),
}

export default (brush) => {
  return (
    colorMap[brush] || availableColors[seed(brush) * availableColors.length]
  )
}
