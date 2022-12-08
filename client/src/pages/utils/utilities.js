import React, { useEffect } from 'react'
import * as dotenv from 'dotenv'
import axios from 'axios'
import useStore from '../../services/useStore'
import { toast } from 'react-toastify'

import './utilities.css'
import ModelCard from '../../components/cards/model-card'
import DatasetCard from '../../components/cards/dataset-card'
import AddCard from '../../components/cards/add-card'

const Utilities = () => {

  // environment config
  dotenv.config()

  // state of the settings aray and the create and delete dialogs
  const datasets = useStore((state) => state.datasets)
  const models = useStore((state) => state.models)

  const deleteDatasetDialogState = useStore((state) => state.deleteDatasetDialogState)
  const createDatasetDialogState = useStore((state) => state.createDatasetDialogState)
  const deleteModelDialogState = useStore((state) => state.deleteModelDialogState)
  const createModelDialogState = useStore((state) => state.createModelDialogState)

  const setDatasets = useStore((state) => state.setDatasets)
  const setModels = useStore((state) => state.setModels)

  // on render get the utilities
  useEffect(() => {
    getUtilities()
  }, [deleteDatasetDialogState, createDatasetDialogState, deleteModelDialogState, createModelDialogState])

  // get requests for the models and datasets info 
  const getUtilities = async (e) => {
    const axiosConfig = {
      Headers: {
        'Content-Type': 'application/json',
      },
    }

    await axios
      .get(process.env.REACT_APP_API_URL + 'getModels', axiosConfig)
      .then((res) => {
        setModels(res.data.map((model) => <ModelCard key={model._id} id={model._id} model={model.model}
          library_name={model.library_name} version={model.version} environment={model.environment} script={model.script} />))
      })
      .catch((e) => {
        toast.configure()
        toast.error('Error getting the models')
      })

    await axios
      .get(process.env.REACT_APP_API_URL + 'getDatasets', axiosConfig)
      .then((res) => {
        setDatasets(res.data.map((dataset) => <DatasetCard key={dataset._id} id={dataset._id}
          dataset_name={dataset.dataset_name} dataset_url={dataset.dataset_url} dataset_format={dataset.dataset_format} dataset_size={dataset.dataset_size} datapoints_number={dataset.datapoints_number} />))
      })
      .catch((e) => {
        toast.configure()
        toast.error('Error getting the datasets')
      })
  }

  // JSX template
  return <div className='utilities-page'>
    <h2 className="utilities-title">Models</h2>
    <div className="utilities-cards-container">
      {models}
      <AddCard object="model" />
    </div>
    <h2 className="utilities-title">Datasets</h2>
    <div className="utilities-cards-container">
      {datasets}
      <AddCard object="dataset" />
    </div>
  </div>
}

export default Utilities