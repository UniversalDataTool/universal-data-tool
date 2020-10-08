import { useReducer } from "react"

export default () => {
  const [{ timeToCompleteSample }, changeSampleTimeToComplete] = useReducer(
    (state, newTimeToComplete) => {
      const newSamplesInWindow = state.samplesInWindow
        .slice(-10)
        .concat([newTimeToComplete])
      return {
        timeToCompleteSample:
          newSamplesInWindow.reduce((acc, a) => acc + a, 0) /
          newSamplesInWindow.length,
        samplesInWindow: newSamplesInWindow,
      }
    },
    { timeToCompleteSample: 0, samplesInWindow: [] }
  )
  return [timeToCompleteSample, changeSampleTimeToComplete]
}
