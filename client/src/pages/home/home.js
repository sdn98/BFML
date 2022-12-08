import React, { useEffect } from 'react'
import * as dotenv from 'dotenv'
import SettingTableRow from '../../components/setting-table-row/setting-table-row'
import axios from 'axios'
import useStore from '../../services/useStore'
import { toast } from 'react-toastify'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import './home.css'

const Home = () => {

  // environment config
  dotenv.config()

  // state of the settings array and the create and delete dialogs
  const settings = useStore((state) => state.settings)
  const setSettings = useStore((state) => state.setSettings)
  const deleteSettingDialogState = useStore((state) => state.deleteSettingDialogState)
  const createSettingDialogState = useStore((state) => state.createSettingDialogState)

  // on render get the settings
  useEffect(() => {
    getSettings()
  }, [deleteSettingDialogState, createSettingDialogState])

  // get request for all settings
  const getSettings = async (e) => {
    const axiosConfig = {
      Headers: {
        'Content-Type': 'application/json',
      },
    }

    await axios
      .get(process.env.REACT_APP_API_URL + 'getSettings', axiosConfig)
      .then((res) => {
        console.log(res.data)
        setSettings(res.data.map((setting) => <SettingTableRow key={setting._id} id={setting._id} identifier={setting.identifier}
          library={setting.setting_model.library_name} version={setting.setting_model.version} model={setting.setting_model.model} clients_number={setting.clients_number} communication_rounds={setting.communication_rounds} fedAlgo={setting.fedAlgo}
          dataset={setting.setting_dataset.dataset_name} GPU={setting.GPU} mode={setting.mode} batch_size={setting.batch_size} learning_rate={setting.learning_rate}
          epochs={setting.epochs} optimizer={setting.optimizer} loss_function={setting.loss_function}
        />))
      })
      .catch((e) => {
        toast.configure()
        toast.error('Error getting the settings')
      })
  }

  // JSX template
  return <div className='settings-page'>
    <TableContainer component={Paper}>
      <Table className="train-table" sx={{ Width: 650 }} size="small" aria-label="a dense table">
        <TableHead className="train-table-head">
          <TableRow>
            <TableCell className="train-table-head-cell">Identifier</TableCell>
            <TableCell className="train-table-head-cell">Library</TableCell>
            <TableCell className="train-table-head-cell">Version</TableCell>
            <TableCell className="train-table-head-cell">Model</TableCell>
            <TableCell className="train-table-head-cell">Strategy</TableCell>
            <TableCell className="train-table-head-cell">Clients Num</TableCell>
            <TableCell className="train-table-head-cell">Comm Rounds</TableCell>
            <TableCell className="train-table-head-cell">Dataset</TableCell>
            <TableCell className="train-table-head-cell">GPU</TableCell>
            <TableCell className="train-table-head-cell">Mode</TableCell>
            <TableCell className="train-table-head-cell">Epochs</TableCell>
            <TableCell className="train-table-head-cell">Batch Size</TableCell>
            <TableCell className="train-table-head-cell">LR</TableCell>
            <TableCell className="train-table-head-cell">Loss</TableCell>
            <TableCell className="train-table-head-cell">OPT</TableCell>
            <TableCell className="train-table-head-cell">Train</TableCell>
            <TableCell className="train-table-head-cell">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {settings}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
}

export default Home
