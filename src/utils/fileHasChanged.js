import isEmpty from "./isEmpty"

export default (objectOfRef, objectToCheck) => {
  // This class return every change in one item of recentItems and its location
  var resultSet = {
    fileName: false,
    content: {
      interface: {
        type: false,
        availableLabels: false,
        regionTypesAllowed: false,
      },
      taskData: false,
      taskOutput: false,
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
    resultSet.content.interface.availableLabels = true
    resultSet.content.interface.regionTypesAllowed = true
    resultSet.content.taskData = true
    resultSet.content.taskOutput = true
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
      resultSet.content.interface.availableLabels = true
      resultSet.content.interface.regionTypesAllowed = true
      resultSet.content.taskData = true
      resultSet.content.taskOutput = true
    } else if (objectToCheck.content !== objectOfRef.content) {
      //Check if the interface doesn't exist or have change
      if (!isEmpty(objectToCheck.content.interface)) {
        if (isEmpty(objectOfRef.content.interface)) {
          resultSet.content.interface.type = true
          resultSet.content.interface.availableLabels = true
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
          //Check if the availableLabels doesn't exist or have change
          if (
            !isEmpty(objectToCheck.content.interface.availableLabels)
          ) {
            if (
              isEmpty(objectOfRef.content.interface.availableLabels)
            ) {
              resultSet.content.interface.availableLabels = true
            } else if (
              objectToCheck.content.interface.availableLabels !==
              objectOfRef.content.interface.availableLabels
            ) {
              resultSet.content.interface.availableLabels = true
            }
          }
          //Check if the regionsTypesAllowed doesn't exist or have change
          if (
            !isEmpty(objectToCheck.content.interface.regionTypesAllowed)
          ) {
            if (
              isEmpty(objectOfRef.content.interface.regionTypesAllowed)
            ) {
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
      //Check if the taskData doesn't exist or have change
      if (!isEmpty(objectToCheck.content.taskData)) {
        if (isEmpty(objectOfRef.content.taskData)) {
          resultSet.content.taskData = true
        } else if (
          objectToCheck.content.taskData !== objectOfRef.content.taskData
        ) {
          resultSet.content.taskData = true
        }
      }
      //Check if the taskOutput doesn't exist or have change
      if (!isEmpty(objectToCheck.content.taskOutput)) {
        if (isEmpty(objectOfRef.content.taskOutput)) {
          resultSet.content.taskOutput = true
        } else if (
          objectToCheck.content.taskOutput !== objectOfRef.content.taskOutput
        ) {
          resultSet.content.taskOutput = true
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
