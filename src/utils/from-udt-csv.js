import JAC from "jac-format"

export default csv => {
  const json = JAC.fromCSV(csv)
  return {
    interface: json.interface,
    taskOutput: json.samples.map(sample => sample.output),
    taskData: json.samples.map(sample => {
      delete sample.output
      return sample
    })
  }
}
