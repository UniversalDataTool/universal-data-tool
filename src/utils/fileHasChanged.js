export default (objectOfRef, objectToCheck) => {
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
  // Vérifie si la donnée existe dans l'objet d'origine
  if (typeof objectToCheck === "undefined") return resultSet

  // Vérifie si la donnée de référence existe
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

  // Vérifie si la donnée id existe et est changé
  if (typeof objectToCheck.id !== "undefined") {
    if (typeof objectOfRef.id === "undefined") resultSet.id = true
    else if (objectToCheck.id !== objectOfRef.id) resultSet.id = true
  }

  // Vérifie si la donnée content existe et est changé
  if (typeof objectToCheck.content !== "undefined") {
    if (typeof objectOfRef.content === "undefined") {
      resultSet.content.interface.type = true
      resultSet.content.interface.availableLabels = true
      resultSet.content.interface.regionTypesAllowed = true
      resultSet.content.taskData = true
      resultSet.content.taskOutput = true
    } else if (objectToCheck.content !== objectOfRef.content) {
      //Vérifie si la donnée interface a changé
      if (typeof objectToCheck.content.interface !== "undefined") {
        if (typeof objectOfRef.content.interface === "undefined") {
          resultSet.content.interface.type = true
          resultSet.content.interface.availableLabels = true
          resultSet.content.interface.regionTypesAllowed = true
        } else if (
          objectToCheck.content.interface !== objectOfRef.content.interface
        ) {
          //Vérifie si la donnée type a changé
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
          //Vérifie si la donnée availableLabels a changé
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
          //Vérifie si la donnée regionTypesAllowed a changé
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
      //Vérifie si la donnée taskData a changé
      if (typeof objectToCheck.content.taskData !== "undefined") {
        if (typeof objectOfRef.content.taskData === "undefined") {
          resultSet.content.taskData = true
        } else if (
          objectToCheck.content.taskData !== objectOfRef.content.taskData
        ) {
          resultSet.content.taskData = true
        }
      }
      //Vérifie si la donnée taskOutput a changé
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

  // Vérifie si la donnée mode existe et est changé
  if (typeof objectToCheck.mode !== "undefined") {
    if (typeof objectOfRef.mode === "undefined") resultSet.mode = true
    else if (objectToCheck.mode !== objectOfRef.mode) resultSet.mode = true
  }

  // Vérifie si la donnée fileName existe et est changé
  if (typeof objectToCheck.fileName !== "undefined") {
    if (typeof objectOfRef.fileName === "undefined") resultSet.fileName = true
    else if (objectToCheck.fileName !== objectOfRef.fileName)
      resultSet.fileName = true
  }
  //Comportement par défaut
  return resultSet
}
