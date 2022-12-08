import * as React from 'react';
import * as dotenv from 'dotenv'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from '../../../services/useStore';

export function CreateDatasetDialog() {

    // environment config
    dotenv.config()

    // state of the create dialog and the different attributes of the dataset as well as functions to control them 
    const dataset_name = useStore((state) => state.dataset_name);
    const dataset_url = useStore((state) => state.dataset_url);
    const dataset_format = useStore((state) => state.dataset_format);
    const dataset_size = useStore((state) => state.dataset_size);
    const datapoints_number = useStore((state) => state.datapoints_number);

    const createDatasetDialogState = useStore((state) => state.createDatasetDialogState);
    const closeCreateDatasetDialog = useStore((state) => state.closeCreateDatasetDialog);

    const addDataset = useStore((state) => state.addDataset);
    const setDatasetName = useStore((state) => state.setDatasetName);
    const setDatasetURL = useStore((state) => state.setDatasetURL);
    const setDatasetFormat = useStore((state) => state.setDatasetFormat);
    const setDatasetSize = useStore((state) => state.setDatasetSize);
    const setDatapointsNum = useStore((state) => state.setDatapointsNum);

    // functions for event change for the different input field
    const onInputChangeDatasetName = (e) => {
        setDatasetName(e.target.value)
    };
    const onInputChangeDatasetURL = (e) => {
        setDatasetURL(e.target.value)
    };
    const onInputChangeDatasetFormat = (e) => {
        setDatasetFormat(e.target.value)
    };
    const onInputChangeDatasetSize = (e) => {
        setDatasetSize(e.target.value)
    };
    const onInputChangeDatapointsNum = (e) => {
        setDatapointsNum(e.target.value)
    };

    // when the user cancels the create dialog the state of the attributes of the dataset is reset to initial state
    const onCancel = (e) => {
        setDatasetName("MNIST")
        setDatasetURL("/mnist")
        setDatasetFormat("img")
        setDatasetSize(30)
        setDatapointsNum(70000)
        closeCreateDatasetDialog()
    };

    // when the user presses submit all of their entries is grouped into a JSON object and sent to the server through a post request
    // then the state of the different attributes of the dataset are reset
    const onSubmit = async (e) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        };
        let data = {
            'dataset_name': dataset_name,
            'dataset_url': "../fml/data" + dataset_url,
            'dataset_format': dataset_format,
            'dataset_size': parseInt(dataset_size),
            'datapoints_number': parseInt(datapoints_number),
        };
        axios.post(process.env.REACT_APP_API_URL + 'createDataset', data, axiosConfig)
            .then((response) => {
                addDataset(response.data)
                toast.configure()
                toast.success('Dataset created successfully')
            })
            .catch((e) => {
                toast.configure()
                toast.error(e.message)
            });
        setDatasetName("MNIST")
        setDatasetURL("/mnist")
        setDatasetFormat("img")
        setDatasetSize(30)
        setDatapointsNum(70000)
        closeCreateDatasetDialog();
    }

    // JSX template
    return <Dialog open={createDatasetDialogState} onClose={closeCreateDatasetDialog}>
        <DialogTitle>Add a Dataset</DialogTitle>
        <DialogContent>
            <DialogContentText className="dialog_text">
                Please enter the attributes of the dataset.
            </DialogContentText>
            <form method="post" action="#" id="#">
                <InputLabel id="demo-simple-select-label">Dataset name</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="dataset_name"
                    defaultValue="MNIST"
                    label="dataset name"
                    onChange={onInputChangeDatasetName}
                    fullWidth
                    required
                >
                    <MenuItem value="MNIST">MNIST</MenuItem>
                    <MenuItem value="CIPHAR-10">CIPHAR-10</MenuItem>
                </Select>
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeDatasetURL}
                    id="dataset_url"
                    label="dataset url"
                    className="dataset_url"
                    defaultValue="/mnist"
                    error={/^\/([^?]+)/.test(dataset_url) ? false : true}
                    helperText={/^\/([^?]+)/.test(dataset_url) ? false : "Please enter a valid dataset url /path/to/data"}
                    type="text"
                    fullWidth
                    required
                />
                <InputLabel id="demo-simple-select-label">Data format</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="dataformat"
                    defaultValue="img"
                    label="dataformat"
                    onChange={onInputChangeDatasetFormat}
                    fullWidth
                    required
                >
                    <MenuItem value="img">img</MenuItem>
                    <MenuItem value="text">text</MenuItem>
                    <MenuItem value="audio">audio</MenuItem>
                    <MenuItem value="time-series">time-series</MenuItem>
                    <MenuItem value="table">table</MenuItem>
                </Select>
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeDatasetSize}
                    id="dataset_size"
                    label="dataset size in MB"
                    className="dataset_size"
                    defaultValue={30}
                    type="number"
                    InputProps={{
                        inputProps: {
                            max: 10000, min: 1
                        }
                    }}
                    fullWidth
                    required
                />
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeDatapointsNum}
                    id="datapoints_number"
                    label="datapoints number"
                    className="datapoints_number"
                    defaultValue={70000}
                    type="number"
                    InputProps={{
                        inputProps: {
                            max: 1000000, min: 1
                        }
                    }}
                    fullWidth
                    required
                />
                <DialogActions>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSubmit}>Add</Button>
                </DialogActions>
            </form>
        </DialogContent>

    </Dialog>
};

export default CreateDatasetDialog;