// @flow weak

import seed from "seed-random"
import * as colors from "@material-ui/core/colors"

const fadedGrey = {
  "600": colors.grey[400],
  "500": colors.grey[300],
  "400": colors.grey[200],
  "300": colors.grey[100],
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
}

export default (brush) => {
  return (
    colorMap[brush] || availableColors[seed(brush) * availableColors.length]
  )
}
