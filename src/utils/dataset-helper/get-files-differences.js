import isEmpty from "lodash/isEmpty"

export default (objectOfRef, objectToCheck) => {
  var resultSet = {
    fileName: false,
    content: {
      interface: {
        type: false,
        labels: false,
        regionTypesAllowed: false,
      },
      samples: false,
    },
    id: false,
    mode: false,
    any: false,
  }
  // Check if the object to check exist if not return false
  if (isEmpty(objectToCheck)) return resultSet

  // Check if the object of reference exist if not return true
  if (isEmpty(objectOfRef)) {
    resultSet.fileName = true
    resultSet.content.interface.type = true
    resultSet.content.interface.labels = true
    resultSet.content.interface.regionTypesAllowed = true
    resultSet.content.samples = true
    resultSet.id = true
    resultSet.mode = true
    resultSet.any = true
    return resultSet
  }

  if (objectOfRef !== objectToCheck) {
    resultSet.any = true
  } else {
    return resultSet
  }

  // Check if the id doesn't exist or have change
  if (!isEmpty(objectToCheck.id)) {
    if (isEmpty(objectOfRef.id)) resultSet.id = true
    else if (objectToCheck.id !== objectOfRef.id) resultSet.id = true
  }

  // Check if the content doesn't exist or have change
  if (!isEmpty(objectToCheck.content)) {
    if (isEmpty(objectOfRef.content)) {
      resultSet.content.interface.type = true
      resultSet.content.interface.labels = true
      resultSet.content.interface.regionTypesAllowed = true
      resultSet.content.samples = true
    } else if (objectToCheck.content !== objectOfRef.content) {
      //Check if the interface doesn't exist or have change
      if (!isEmpty(objectToCheck.content.interface)) {
        if (isEmpty(objectOfRef.content.interface)) {
          resultSet.content.interface.type = true
          resultSet.content.interface.labels = true
          resultSet.content.interface.regionTypesAllowed = true
        } else if (
          objectToCheck.content.interface !== objectOfRef.content.interface
        ) {
          //Check if the type doesn't exist or have change
          if (!isEmpty(objectToCheck.content.interface.type)) {
            if (isEmpty(objectOfRef.content.interface.type)) {
              resultSet.content.interface.type = true
            } else if (
              objectToCheck.content.interface.type !==
              objectOfRef.content.interface.type
            ) {
              resultSet.content.interface.type = true
            }
          }
          //Check if the labels doesn't exist or have change
          if (!isEmpty(objectToCheck.content.interface.labels)) {
            if (isEmpty(objectOfRef.content.interface.labels)) {
              resultSet.content.interface.labels = true
            } else if (
              objectToCheck.content.interface.labels !==
              objectOfRef.content.interface.labels
            ) {
              resultSet.content.interface.labels = true
            }
          }
          //Check if the regionsTypesAllowed doesn't exist or have change
          if (!isEmpty(objectToCheck.content.interface.regionTypesAllowed)) {
            if (isEmpty(objectOfRef.content.interface.regionTypesAllowed)) {
              resultSet.content.interface.regionTypesAllowed = true
            } else if (
              objectToCheck.content.interface.regionTypesAllowed !==
              objectOfRef.content.interface.regionTypesAllowed
            ) {
              resultSet.content.interface.regionTypesAllowed = true
            }
          }
        }
      }
      //Check if the samples doesn't exist or have change
      if (!isEmpty(objectToCheck.content.samples)) {
        if (isEmpty(objectOfRef.content.samples)) {
          resultSet.content.samples = true
        } else if (
          objectToCheck.content.samples !== objectOfRef.content.samples
        ) {
          resultSet.content.samples = true
        }
      }
    }
  }

  // Check if the mode doesn't exist or have change
  if (!isEmpty(objectToCheck.mode)) {
    if (isEmpty(objectOfRef.mode)) resultSet.mode = true
    else if (objectToCheck.mode !== objectOfRef.mode) resultSet.mode = true
  }

  // Check if the fileName doesn't exist or have change
  if (!isEmpty(objectToCheck.fileName)) {
    if (isEmpty(objectOfRef.fileName)) resultSet.fileName = true
    else if (objectToCheck.fileName !== objectOfRef.fileName)
      resultSet.fileName = true
  }
  //Default behavior return false
  return resultSet
}
