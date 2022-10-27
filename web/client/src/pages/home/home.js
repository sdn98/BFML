import React, { useEffect } from 'react'
import SettingCard from '../../components/setting-card/setting-card'
import SettingTitles from '../../components/setting-titles/setting-titles'
import axios from 'axios'
import useStore from '../../services/useStore'
import { toast } from 'react-toastify'

import './home.css'

const Home = () => {
  const settings = useStore((state) => state.settings)
  const setSettings = useStore((state) => state.setSettings)
  const deleteDialogState = useStore((state) => state.deleteDialogState)
  const createDialogState = useStore((state) => state.createDialogState)

  const getSettings = async (e) => {
    const axiosConfig = {
      Headers: {
        'Content-Type': 'application/json',
      },
    }
    await axios
      .get('http://localhost:5000/api/settings/getSettings', axiosConfig)
      .then((res) => {
   
        setSettings(res.data.map((setting) => <SettingCard key={setting._id} id={setting._id} identifier={setting.identifier} 
        library={setting.library} version={setting.version} model={setting.model} clients_number={setting.clients_number} fedAlgo={setting.fedAlgo} 
        dataset={setting.dataset} dataset_url={setting.dataset_url} dataset_format={setting.dataset_format} dataset_size={setting.dataset_size} datapoints_number={setting.datapoints_number} 
        GPU={setting.GPU} mode={setting.mode} batch_size={setting.batch_size} learning_rate={setting.learning_rate} 
        epochs={setting.epochs} optimizer={setting.optimizer}  loss_function={setting.loss_function}
        />))
      })
      .catch((e) => {
        toast.configure()
        toast.error('Error getting the settings')
      })
  }

  useEffect(() => {
    getSettings()
  }, [createDialogState, deleteDialogState])

  return <div className='settings-page'>
    <SettingTitles className='settings-titles'/>
   {settings}
    </div>
}

export default Home