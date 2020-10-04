import { atom, useRecoilState, useRecoilValue } from "recoil"

export const activeDatasetManagerState = atom({
  default: null,
  key: "datasetManager",
})

export default () => {
  return useRecoilState(activeDatasetManagerState)
}
