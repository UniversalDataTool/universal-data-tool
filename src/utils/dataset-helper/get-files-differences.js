import isEmpty from "lodash/isEmpty"

export default (objectOfRef, objectToCheck) => {
  var resultSet = {
    name: false,
    interface: {
      type: false,
      labels: false,
      regionTypesAllowed: false,
    },
    samples: false,
    id: false,
    mode: false,
    any: false,
  }
  // Check if the object to check exist if not return false
  if (isEmpty(objectToCheck)) return resultSet

  // Check if the object of reference exist if not return true
  if (isEmpty(objectOfRef)) {
    resultSet.name = true
    resultSet.interface.type = true
    resultSet.interface.labels = true
    resultSet.interface.regionTypesAllowed = true
    resultSet.samples = true
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
  if (!isEmpty(objectToCheck)) {
    if (isEmpty(objectOfRef)) {
      resultSet.interface.type = true
      resultSet.interface.labels = true
      resultSet.interface.regionTypesAllowed = true
      resultSet.samples = true
    } else if (objectToCheck !== objectOfRef) {
      //Check if the interface doesn't exist or have change
      if (!isEmpty(objectToCheck.interface)) {
        if (isEmpty(objectOfRef.interface)) {
          resultSet.interface.type = true
          resultSet.interface.labels = true
          resultSet.interface.regionTypesAllowed = true
        } else if (objectToCheck.interface !== objectOfRef.interface) {
          //Check if the type doesn't exist or have change
          if (!isEmpty(objectToCheck.interface.type)) {
            if (isEmpty(objectOfRef.interface.type)) {
              resultSet.interface.type = true
            } else if (
              objectToCheck.interface.type !== objectOfRef.interface.type
            ) {
              resultSet.interface.type = true
            }
          }
          //Check if the labels doesn't exist or have change
          if (!isEmpty(objectToCheck.interface.labels)) {
            if (isEmpty(objectOfRef.interface.labels)) {
              resultSet.interface.labels = true
            } else if (
              objectToCheck.interface.labels !== objectOfRef.interface.labels
            ) {
              resultSet.interface.labels = true
            }
          }
          //Check if the regionsTypesAllowed doesn't exist or have change
          if (!isEmpty(objectToCheck.interface.regionTypesAllowed)) {
            if (isEmpty(objectOfRef.interface.regionTypesAllowed)) {
              resultSet.interface.regionTypesAllowed = true
            } else if (
              objectToCheck.interface.regionTypesAllowed !==
              objectOfRef.interface.regionTypesAllowed
            ) {
              resultSet.interface.regionTypesAllowed = true
            }
          }
        }
      }
      //Check if the samples doesn't exist or have change
      if (!isEmpty(objectToCheck.samples)) {
        if (isEmpty(objectOfRef.samples)) {
          resultSet.samples = true
        } else if (objectToCheck.samples !== objectOfRef.samples) {
          resultSet.samples = true
        }
      }
    }
  }

  // Check if the mode doesn't exist or have change
  if (!isEmpty(objectToCheck.mode)) {
    if (isEmpty(objectOfRef.mode)) resultSet.mode = true
    else if (objectToCheck.mode !== objectOfRef.mode) resultSet.mode = true
  }

  // Check if the name doesn't exist or have change
  if (!isEmpty(objectToCheck.name)) {
    if (isEmpty(objectOfRef.name)) resultSet.name = true
    else if (objectToCheck.name !== objectOfRef.name) resultSet.name = true
  }
  //Default behavior return false
  return resultSet
}
