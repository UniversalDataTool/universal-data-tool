const ConfigImportIsReady = (projectToFetch, configImport) => {
  if (!projectToFetch || projectToFetch === "") return false
  if (
    configImport.loadAssetsIsSelected &&
    (configImport.typeOfFileToLoad === "None" ||
      configImport.typeOfFileToLoad === undefined)
  )
    return false

  return true
}
export default ConfigImportIsReady
