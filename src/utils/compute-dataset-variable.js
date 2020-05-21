export default (dataset, varName) => {
  let fields = (dataset.interface || {}).fields || []
  const totalLabels = fields.reduce(
    (acc, f) =>
      f.interface.type !== "data_entry"
        ? acc
        : acc + (f.interface.surveyjs.questions[0].choices || []).length,
    0
  )
  const totalBoundingBoxes = fields.filter(
    (f) => f.interface.type === "image_segmentation"
  ).length

  switch (varName) {
    case "sample_count":
    case "num_samples":
      return (dataset.samples || []).length
    case "number_of_fields":
      return Object.keys(dataset.interface.fields || {}).length
    case "text_field_count":
      if (dataset.interface.type === "data_entry") {
        return dataset.interface.surveyjs.questions.filter(
          (q) => q.type === "text"
        ).length
      } else if (dataset.interface.type === "composite") {
        return fields.filter(
          (f) =>
            f.interface.type === "data_entry" &&
            f.interface.surveyjs.questions[0].type === "text"
        ).length
      }
    case "number_of_classifications":
      return dataset.interface.labels.length
    default:
      throw new Error(`Don't know how to compute "${varName}"`)
  }
}
