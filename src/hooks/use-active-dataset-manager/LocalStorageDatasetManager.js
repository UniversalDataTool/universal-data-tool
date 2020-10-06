import type { DatasetManager } from "./types"
import { EventEmitter } from "events"
import { from as seamless, set, merge, setIn } from "seamless-immutable"

const getNewSampleRefId = () => "s" + Math.random().toString(36).slice(-8)

class LocalStorageDatasetManager extends EventEmitter {
  // implements DatasetManager {
  udtJSON: Object
  type = "local-storage"

  constructor() {
    super()
    this.udtJSON = seamless({
      name: "New Dataset",
      interface: {},
      samples: [],
    })
  }

  // Called frequently to make sure the dataset is accessible, return true if
  // the dataset can be read. You might return false if there isn't a dataset
  // loaded
  // Protip: If you have a server you should establish a connection here if
  // you can
  isReady = async () => {
    return true
  }

  // Gives a summary of the dataset, mostly just indicating if the samples
  // are annotated are not.
  // https://github.com/UniversalDataTool/udt-format/blob/master/proposals/summary.md
  getSummary = async () => {
    // TODO cache the summary
    return {
      samples: this.udtJSON.samples.map((s) => ({
        hasAnnotation: Boolean(s.annotation),
        _id: s._id,
      })),
    }
  }

  // Get or set the dataset interface, training, or other top levels keys (not
  // samples). For example, getDatasetProperty('interface') returns the interface.
  // You can and should create a new object here if you have custom stuff you
  // want to store in the dataset for your server
  getDatasetProperty = async (key) => {
    return this.udtJSON[key]
  }
  setDatasetProperty = async (key, newValue) => {
    if (typeof newValue === "object") {
      this.udtJSON = set(
        this.udtJSON,
        key,
        merge(this.udtJSON[key], newValue, { deep: true })
      )
    } else {
      this.udtJSON = set(this.udtJSON, key, newValue)
    }
    this.emit("dataset-property-changed", { key })
  }

  // Two ways to get a sample. Using `sampleRefId` will return the sample with
  // an `_id` === sampleRefId
  getSampleByIndex = async (index: number) => {
    return this.udtJSON.samples[index]
  }
  getSample = async (sampleRefId: string) => {
    return this.udtJSON.samples.find((s) => s._id === sampleRefId)
  }

  // Set a new value for a sample
  setSample = async (sampleRefId: string, newSample: Object) => {
    const sampleIndex = this.udtJSON.samples.findIndex(
      (s) => s._id === sampleRefId
    )
    this.udtJSON = setIn(this.udtJSON, ["samples", sampleIndex], newSample)
  }

  // Called whenever application config is updated. Maybe you need the app config
  // to access some authentication variables
  onUpdateAppConfig = async (appConfig) => {}

  // Import an entire UDT JSON file
  loadDataset = async (udtObject) => {
    this.udtJSON = seamless({
      name: "Imported Dataset",
      interface: {},
      ...udtObject,
      samples: (udtObject.samples || []).map((s) => ({
        _id: getNewSampleRefId(),
        ...s,
      })),
    })
  }

  // Add samples to the dataset
  addSamples = async (newSamples: Array<Object>) => {
    this.udtJSON = setIn(
      this.udtJSON,
      ["samples"],
      this.udtJSON.samples.concat(
        newSamples.map((s) => ({
          _id: getNewSampleRefId(),
          ...s,
        }))
      )
    )
    this.emit("summary-changed")
  }

  // Remove samples
  removeSamples = async (sampleIds: Array<string>) => {
    this.udtJSON = setIn(
      this.udtJSON,
      ["samples"],
      this.udtJSON.samples.filter((s) => !sampleIds.includes(s._id))
    )
    this.emit("summary-changed")
  }

  // -------------------------------
  // OPTIONAL
  // -------------------------------

  // Datasets can be explictly saved for some interfaces (e.g. FileSystem)
  // explicitSave(): Promise<void> {}

  // Can be called to preload the contents of a sample to make for a more
  // responsive interface
  // preloadSampleByIndex(index: number) {}
  // preloadSample(sampleRefId: string) {}

  // We assume we can write to the dataset if not specified
  isWritable = async () => {
    return true
  }
}

export default LocalStorageDatasetManager
