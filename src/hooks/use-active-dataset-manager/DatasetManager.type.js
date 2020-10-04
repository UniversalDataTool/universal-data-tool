// Take a quick look at the UDT JSON format before implementing this
// https://github.com/UniversalDataTool/udt-format
// If you're having trouble, check out the LocalStorageDatasetManager

interface DatasetManager {
  // Import an entire UDT JSON file
  importDataset(udtObject: Object): Promise<void>;

  // Called frequently to make sure the dataset is accessible, return true if
  // the dataset can be read. You might return false if there isn't a dataset
  // loaded
  // Protip: If you have a server you should establish a connection here (if not connected)
  isReady(): Promise<boolean>;

  // Gives a summary of the dataset, mostly just indicating if the samples
  // are annotated are not.
  // https://github.com/UniversalDataTool/udt-format/blob/master/proposals/summary.md
  getSummary(): Promise<Object>;

  // Get or set the dataset training, file paths or other top levels keys (not
  // samples). For example, getDatasetProperty('training') returns the labeler
  // training configuration. getDatasetProperty('name') returns the name.
  // You can and should create a new object here if you have custom stuff you
  // want to store in the dataset
  getDatasetProperty(key: string): Promise<Object>;
  setDatasetProperty(key: string, newValue: Object): Promise<Object>;

  // Two ways to get a sample. Using `sampleRefId` will return the sample with
  // an `_id` === sampleRefId
  getSampleByIndex(index: number): Promise<Object>;
  getSample(sampleRefId: string): Promise<Object>;

  // Set a new value for a sample
  setSample(sampleRefId: string, newSample: Object): Promise<void>;

  // Add samples to the dataset
  addSamples(samples: Array<Object>): Promise<void>;

  // Remove samples
  removeSamples(sampleIds: Array<string>): Promise<void>;

  // -------------------------------
  // EVENTS
  // You don't need to implement events, but they may help in collaborative
  // settings or for displaying notifications.
  // -------------------------------

  on(
    event:
      | "dataset-property-changed" // passes { key: "interface" | "training" | "etc" }
      | "sample-changed" // passes { sampleRefId }
      | "sampled-changed-by-someone-else" // passes { sampleRefId }
      | "error" // passes { message }
      | "notify-user" // passes { message }
      | "connected"
      | "disconnected",
    Function
  ): void;

  // -------------------------------
  // OPTIONAL
  // -------------------------------

  // Called whenever application config is updated. Maybe you need the app config
  // to access some authentication variables
  onUpdateAppConfig?: (appConfig) => void;

  // Datasets can be explictly saved for some interfaces (e.g. FileSystem)
  explicitSave?: () => Promise<void>;

  // Can be called to preload the contents of a sample to make for a more
  // responsive interface
  preloadSampleByIndex?: (index: number) => void;
  preloadSample?: (sampleRefId: string) => void;

  // We assume we can write to the dataset if not specified
  isWritable?: () => boolean;
}
