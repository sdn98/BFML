import create from 'zustand'

const useStore = create((set) => ({

  // initial states
  // initial states of the dialogs
  deleteSettingDialogState: false,
  createSettingDialogState: false,
  deleteDatasetDialogState: false,
  createDatasetDialogState: false,
  deleteModelDialogState: false,
  createModelDialogState: false,

  // initial states of the settings, datasets, and models
  settings: [],
  datasets: [],
  models: [],

  // initial state of a specific setting and its metrics
  setting: '',
  metrics: '',

  // initial state of the models and dataset in the setting creation menu
  models_menu: [],
  datasets_menu: [],

  // initial states of the different attributes of a setting
  identifier: '',
  fedAlgo: 'fedAvg',
  clients_number: 2,
  communication_rounds: 3,
  setting_model: '',
  dataset: '',
  GPU: "False",
  mode: 'simulations',
  epochs: 10,
  batch_size: 30,
  learning_rate: '1',
  loss_function: 'cross_entropy',
  optimizer: 'sdg',

  // initial states of the different attributes of a model
  model: 'CNN',
  library_name: 'pysyft',
  version: '0.2.9',
  environment: 'pysyft',
  script: 'image_classifier',
  
  // initial states of the different attributes of a dataset
  dataset_name: 'MNIST',
  dataset_url: '/mnist',
  dataset_format: 'img',
  dataset_size: 30,
  datapoints_number: 70000,

  // open and close the dialogs for settings
  openDeleteSettingDialog: () => set((state) => ({ deleteSettingDialogState: true })),
  closeDeleteSettingDialog: () => set((state) => ({ deleteSettingDialogState: false })),
  openCreateSettingDialog: () => set((state) => ({ createSettingDialogState: true })),
  closeCreateSettingDialog: () => set((state) => ({ createSettingDialogState: false })),

  // open and close the dialogs for datasets
  openDeleteDatasetDialog: () => set((state) => ({ deleteDatasetDialogState: true })),
  closeDeleteDatasetDialog: () => set((state) => ({ deleteDatasetDialogState: false })),
  openCreateDatasetDialog: () => set((state) => ({ createDatasetDialogState: true })),
  closeCreateDatasetDialog: () => set((state) => ({ createDatasetDialogState: false })),

  // open and close the dialogs for models
  openDeleteModelDialog: () => set((state) => ({ deleteModelDialogState: true })),
  closeDeleteModelDialog: () => set((state) => ({ deleteModelDialogState: false })),
  openCreateModelDialog: () => set((state) => ({ createModelDialogState: true })),
  closeCreateModelDialog: () => set((state) => ({ createModelDialogState: false })),

  // setter for a specific setting, and metrics
  setSetting: (setting) => set((state) => ({ setting: setting })),
  setMetrics: (metrics) => set((state) => ({ metrics: metrics })),

  // setter for the array of settings in the home page, as well as models and datasets in the utilities page
  setSettings: (settings) => set((state) => ({ settings: settings })),
  setDatasets: (datasets) => set((state) => ({ datasets: datasets })),
  setModels: (models) => set((state) => ({ models: models })),

  // add and remove elements from the settings array
  addSetting: (setting) =>
    set((state) => ({
      settings: [state.settings.push(setting)],
    })),

  removeSetting: (id) =>
    set((state) => ({
      settings: state.settings.filter((setting) => setting.id !== id),
    })),

  // add and remove elements from the datasets array
  addDataset: (dataset) =>
    set((state) => ({
      datasets: [state.datasets.push(dataset)],
    })),

  removeDataset: (id) =>
    set((state) => ({
      datasets: state.datasets.filter((dataset) => dataset.id !== id),
    })),

  // add and remove elements from the models array
  addModel: (model) =>
    set((state) => ({
      models: [state.models.push(model)],
    })),

  removeModel: (id) =>
    set((state) => ({
      models: state.models.filter((model) => model.id !== id),
    })),

  // setters for the states of the different attributes of a setting
  setIdentifier: (identifier) => set((state) => ({ identifier: identifier })),
  setSettingModel: (setting_model) => set((state) => ({ setting_model: setting_model })),
  setDataset: (dataset) => set((state) => ({ dataset: dataset })),
  setFedAlgo: (fedAlgo) => set((state) => ({ fedAlgo: fedAlgo })),
  setClientNum: (clients_number) => set((state) => ({ clients_number: clients_number })),
  setCommRound: (communication_rounds) => set((state) => ({ communication_rounds: communication_rounds })),
  setGPU: (GPU) => set((state) => ({ GPU: GPU })),
  setMode: (mode) => set((state) => ({ mode: mode })),
  setEpochs: (epochs) => set((state) => ({ epochs: epochs })),
  setBatchSize: (batch_size) => set((state) => ({ batch_size: batch_size })),
  setLearningRate: (learning_rate) => set((state) => ({ learning_rate: learning_rate })),
  setLossFunction: (loss_function) => set((state) => ({ loss_function: loss_function })),
  setOptimizer: (optimizer) => set((state) => ({ optimizer: optimizer })),

  // setters for the states of the different attributes of a model
  setModel: (model) => set((state) => ({ model: model })),
  setLibraryName: (library_name) => set((state) => ({ library_name: library_name })),
  setVersion: (version) => set((state) => ({ version: version })),
  setEnvironment: (environment) => set((state) => ({ environment: environment })),
  setScript: (script) => set((state) => ({ script: script })),

  // setters for the states of the different attributes of a dataset
  setDatasetName: (dataset_name) => set((state) => ({ dataset_name: dataset_name })),
  setDatasetURL: (dataset_url) => set((state) => ({ dataset_url: dataset_url })),
  setDatasetFormat: (dataset_format) => set((state) => ({ dataset_format: dataset_format })),
  setDatasetSize: (dataset_size) => set((state) => ({ dataset_size: dataset_size })),
  setDatapointsNum: (datapoints_number) => set((state) => ({ datapoints_number: datapoints_number })),

  // setters for the states of the models and datasets in the setting creation menu
  setModelsMenu: (models_menu) => set((state) => ({ models_menu: models_menu })),
  setDatasetsMenu: (datasets_menu) => set((state) => ({ datasets_menu: datasets_menu }))
}))
export default useStore
