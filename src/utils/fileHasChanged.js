export default (objectOfRef, objectToCheck) => {
  // This class return every change in the localStorage and its location
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
  }
  // Check if the object to check exist if not return false
  if (typeof objectToCheck === "undefined") return resultSet

  // Check if the object of reference exist if not return true
  if (typeof objectOfRef === "undefined") {
    resultSet.fileName = true
    resultSet.content.interface.type = true
    resultSet.content.interface.availableLabels = true
    resultSet.content.interface.regionTypesAllowed = true
    resultSet.content.taskData = true
    resultSet.content.taskOutput = true
    resultSet.id = true
    resultSet.mode = true
    return resultSet
  }

  // Check if the id doesn't exist or have change
  if (typeof objectToCheck.id !== "undefined") {
    if (typeof objectOfRef.id === "undefined") resultSet.id = true
    else if (objectToCheck.id !== objectOfRef.id) resultSet.id = true
  }

  // Check if the content doesn't exist or have change
  if (typeof objectToCheck.content !== "undefined") {
    if (typeof objectOfRef.content === "undefined") {
      resultSet.content.interface.type = true
      resultSet.content.interface.availableLabels = true
      resultSet.content.interface.regionTypesAllowed = true
      resultSet.content.taskData = true
      resultSet.content.taskOutput = true
    } else if (objectToCheck.content !== objectOfRef.content) {
      //Check if the interface doesn't exist or have change
      if (typeof objectToCheck.content.interface !== "undefined") {
        if (typeof objectOfRef.content.interface === "undefined") {
          resultSet.content.interface.type = true
          resultSet.content.interface.availableLabels = true
          resultSet.content.interface.regionTypesAllowed = true
        } else if (
          objectToCheck.content.interface !== objectOfRef.content.interface
        ) {
          //Check if the type doesn't exist or have change
          if (typeof objectToCheck.content.interface.type !== "undefined") {
            if (typeof objectOfRef.content.interface.type === "undefined") {
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
            typeof objectToCheck.content.interface.availableLabels !==
            "undefined"
          ) {
            if (
              typeof objectOfRef.content.interface.availableLabels ===
              "undefined"
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
            typeof objectToCheck.content.interface.regionTypesAllowed !==
            "undefined"
          ) {
            if (
              typeof objectOfRef.content.interface.regionTypesAllowed ===
              "undefined"
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
      if (typeof objectToCheck.content.taskData !== "undefined") {
        if (typeof objectOfRef.content.taskData === "undefined") {
          resultSet.content.taskData = true
        } else if (
          objectToCheck.content.taskData !== objectOfRef.content.taskData
        ) {
          resultSet.content.taskData = true
        }
      }
      //Check if the taskOutput doesn't exist or have change
      if (typeof objectToCheck.content.taskOutput !== "undefined") {
        if (typeof objectOfRef.content.taskOutput === "undefined") {
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
  if (typeof objectToCheck.mode !== "undefined") {
    if (typeof objectOfRef.mode === "undefined") resultSet.mode = true
    else if (objectToCheck.mode !== objectOfRef.mode) resultSet.mode = true
  }

  // Check if the fileName doesn't exist or have change
  if (typeof objectToCheck.fileName !== "undefined") {
    if (typeof objectOfRef.fileName === "undefined") resultSet.fileName = true
    else if (objectToCheck.fileName !== objectOfRef.fileName)
      resultSet.fileName = true
  }
  //Default behavior return false
  return resultSet
}
