export default (dataset, varName) => {
  let fields = (dataset.interface || {}).fields || []

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
      break
    case "number_of_classifications":
      return dataset.interface.labels.length
    default:
      throw new Error(`Don't know how to compute "${varName}"`)
  }
}
