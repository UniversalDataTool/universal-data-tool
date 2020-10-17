# Dataset Managers

Dataset Managers control the synchronization of a dataset with a persistent storage
system, like a server, filesystem or local storage. Dataset Managers are easy
to implement. Just implement the following interface to create a new dataset
manager (see `DatasetManager.type.js` for more options):

```javascript
// Take a quick look at the UDT JSON format before implementing this
// https://github.com/UniversalDataTool/udt-format
// If you're having trouble, check out the LocalStorageDatasetManager

interface DatasetManager {
  // Called frequently to make sure the dataset is accessible, return true if
  // the dataset can be read. You might return false if there isn't a dataset
  // loaded
  // Protip: If you have a server you should establish a connection here if
  // you can
  isReady(): Promise<boolean>;

  // Gives a summary of the dataset, mostly just indicating if the samples
  // are annotated are not.
  // https://github.com/UniversalDataTool/udt-format/blob/master/proposals/summary.md
  getSummary(): Promise<Object>;

  // Get or set the dataset interface
  getInterface(): Promise<Object>;
  setInterface(): Promise<Object>;

  // Get or set the dataset training, file paths or other top levels keys (not
  // samples). For example, getDatasetProperty('training') returns the labeler
  // training configuration.
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
}
```

## Setting a Dataset Manager

Somewhere in the abyss, a component must perform the following ritual...

```javascript
const SomeComponent = () => {
  const [
    activeDatasetManager,
    setActiveDatasetManager,
  ] = useActiveDatasetManager()

  return (
    <button onClick={() => setActiveDatasetManager(new MyDatasetManager())}>
      Change to my dataset manager
    </button>
  )
}
```
