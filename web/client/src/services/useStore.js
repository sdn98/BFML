import create from 'zustand'

const useStore = create((set) => ({
  
  deleteDialogState: false,
  createDialogState: false,
  settings: [],
  setting: '',
  trained: '',
  identifier: '',
  library: 'pysyft',
  version: '0.2.9',
  model: 'CNN',
  fedAlgo: 'fedAvg',
  clients_number: 0,
  dataset: 'MNIST',
  dataset_url: '/mnist/gz/mnist_train',
  dataset_format: 'img',
  dataset_size: 50,
  datapoints_number: 5000,
  GPU: false,
  mode: 'simulations',
  epochs: 30,
  batch_size: 32,
  learning_rate: '1',
  loss_function: 'cross_entropy',
  optimizer: 'sdg',


  openDeleteDialog: () => set((state) => ({ deleteDialogState: true })),
  closeDeleteDialog: () => set((state) => ({ deleteDialogState: false })),
  openCreateDialog: () => set((state) => ({ createDialogState: true })),
  closeCreateDialog: () => set((state) => ({ createDialogState: false })),

  setSetting: (setting) => set((state) => ({ setting: setting })),
  setTrained: (trained) => set((state) => ({ trained: trained })),
  setSettings: (settings) => set((state) => ({ settings: settings })),
  addSetting: (setting) =>
    set((state) => ({
      settings: [state.settings.push(setting)],
    })),
  removeSetting: (id) =>
    set((state) => ({
      settings: state.settings.filter((setting) => setting.id !== id),
    })),

    setIdentifier: (identifier) => set((state) => ({ identifier: identifier })),
    setLibrary: (library) => set((state) => ({ library: library })),
    setVersion: (version) => set((state) => ({ version: version })),
    setModel: (model) => set((state) => ({ model: model })),
    setFedAlgo: (fedAlgo) => set((state) => ({ fedAlgo: fedAlgo })),
    setClientNum: (clients_number) => set((state) => ({ clients_number: clients_number })),
    setDataset: (dataset) => set((state) => ({ dataset: dataset })),
    setDatasetURL: (dataset_url) => set((state) => ({ dataset_url: dataset_url })),
    setDatasetFormat: (dataset_format) => set((state) => ({ dataset_format: dataset_format })),
    setDatasetSize: (dataset_size) => set((state) => ({ dataset_size: dataset_size })),
    setDatapointsNum: (datapoints_number) => set((state) => ({ datapoints_number: datapoints_number })),
    setGPU: (GPU) => set((state) => ({ GPU: GPU })),
    setMode: (mode) => set((state) => ({ mode: mode })),
    setEpochs: (epochs) => set((state) => ({ epochs: epochs })),
    setBatchSize: (batch_size) => set((state) => ({ batch_size: batch_size })),
    setLearningRate: (learning_rate) => set((state) => ({ learning_rate: learning_rate })),  
    setLossFunction: (loss_function) => set((state) => ({ loss_function: loss_function })),
    setOptimizer: (optimizer) => set((state) => ({ optimizer: optimizer })),

}))
export default useStore
