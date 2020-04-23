/*
This doesn't handle a fair number of edge cases, for the full specification
for what it should implement, see https://tools.ietf.org/html/rfc6902

When applySeamlessPatch is called, it usually is accompanied by a object hash
check to make sure that the patch applied correctly, and if not, perform
a download of the latest version. Because of this, we can safely ignore the
tricky edge cases.
*/

import seamless from "seamless-immutable"

const { setIn, getIn, updateIn, without } = seamless

function addToArray(a, newValue) {
  return a.concat([newValue])
}

function withoutIn(obj, path) {
  if (path.length === 0) return without(obj, path[0])
  const parentPath = path.slice(0, -1)
  const key = path[path.length - 1]
  const parentObj = getIn(obj, parentPath)
  if (Array.isArray(parentObj)) {
    const index = parseInt(key)
    return setIn(obj, parentPath, [
      ...parentObj.slice(0, index),
      ...parentObj.slice(index + 1),
    ])
  } else {
    return setIn(obj, parentPath, without(parentObj, key))
  }
}

export default (object, patches) => {
  for (const patch of patches) {
    let { op, path } = patch
    path = path.split("/").filter(Boolean)
    if (path.length === 0) {
      // this operation is on the root object, special handling should apply
      if (op === "replace") {
        object = patch.value
        continue
      }
      throw new Error("Operation on root object not supported")
    }
    switch (op) {
      case "replace": {
        object = setIn(object, path, patch.value)
        continue
      }
      case "copy": {
        object = setIn(object, path, getIn(object, patch.from.split("/")))
        continue
      }
      case "add": {
        if (!isNaN(parseInt(path.slice(-1)[0]))) {
          object = setIn(object, path, patch.value)
        } else {
          const arrayAtPath = Array.isArray(getIn(object, path))
          if (arrayAtPath) {
            object = updateIn(object, path, addToArray, patch.value)
          } else {
            object = setIn(object, path, patch.value)
          }
        }
        continue
      }
      case "move": {
        const from = patch.from.split("/")
        object = setIn(object, path, getIn(object, from))
        object = withoutIn(object, from)
        continue
      }
      case "remove": {
        object = withoutIn(object, path)
        continue
      }
    }
  }
  return object
}
