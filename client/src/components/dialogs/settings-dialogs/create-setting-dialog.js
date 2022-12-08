import React from 'react'
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
import useStore from "../../../services/useStore";



export function CreateSettingDialog() {

    // environment config
    dotenv.config()

    // state od the create dialog and the different attributes of the setting as well as functions to control them 
    const models_menu = useStore((state) => state.models_menu);
    const datasets_menu = useStore((state) => state.datasets_menu);

    const identifier = useStore((state) => state.identifier);
    const setting_model = useStore((state) => state.setting_model);
    const dataset = useStore((state) => state.dataset);
    const fedAlgo = useStore((state) => state.fedAlgo);
    const clients_number = useStore((state) => state.clients_number);
    const communication_rounds = useStore((state) => state.communication_rounds);
    const GPU = useStore((state) => state.GPU);
    const mode = useStore((state) => state.mode);
    const batch_size = useStore((state) => state.batch_size);
    const learning_rate = useStore((state) => state.learning_rate);
    const epochs = useStore((state) => state.epochs);
    const optimizer = useStore((state) => state.optimizer);
    const loss_function = useStore((state) => state.loss_function);

    const createSettingDialogState = useStore((state) => state.createSettingDialogState);
    const closeCreateSettingDialog = useStore((state) => state.closeCreateSettingDialog);

    const addSetting = useStore((state) => state.addSetting);
    const setIdentifier = useStore((state) => state.setIdentifier);
    const setSettingModel = useStore((state) => state.setSettingModel);
    const setDataset = useStore((state) => state.setDataset);
    const setFedAlgo = useStore((state) => state.setFedAlgo);
    const setClientNum = useStore((state) => state.setClientNum);
    const setCommRound = useStore((state) => state.setCommRound);
    const setGPU = useStore((state) => state.setGPU);
    const setMode = useStore((state) => state.setMode);
    const setEpochs = useStore((state) => state.setEpochs);
    const setBatchSize = useStore((state) => state.setBatchSize);
    const setLearningRate = useStore((state) => state.setLearningRate);
    const setLossFunction = useStore((state) => state.setLossFunction);
    const setOptimizer = useStore((state) => state.setOptimizer);
    const setModelsMenu = useStore((state) => state.setModelsMenu);
    const setDatasetsMenu = useStore((state) => state.setDatasetsMenu);

    // functions for event change for the different input field
    const onInputChangeIdentifier = (e) => {
        setIdentifier(e.target.value)
    };
    const onInputChangeModel = (e) => {
        setSettingModel(e.target.value)
    };
    const onInputChangeDataset = (e) => {
        setDataset(e.target.value)
    };
    const onInputChangeFedAlgo = (e) => {
        setFedAlgo(e.target.value)
    };
    const onInputChangeClientNum = (e) => {
        setClientNum(e.target.value)
    };
    const onInputChangeCommRound = (e) => {
        setCommRound(e.target.value)
    };
    const onInputChangeGPU = (e) => {
        setGPU(e.target.value)
    };
    const onInputChangeMode = (e) => {
        setMode(e.target.value)
    };
    const onInputChangeEpochs = (e) => {
        setEpochs(e.target.value)
    };
    const onInputChangeBatchSize = (e) => {
        setBatchSize(e.target.value)
    };
    const onInputChangeLearningRate = (e) => {
        setLearningRate(e.target.value)
    };
    const onInputChangeLossFunction = (e) => {
        setLossFunction(e.target.value)
    };
    const onInputChangeOptimizer = (e) => {
        setOptimizer(e.target.value)
    };

    // when the user cancels the create dialog the state of the attributes of the setting is reset to initial state
    const onCancel = (e) => {
        setIdentifier("")
        setSettingModel("")
        setDataset("")
        setFedAlgo("fedAvg")
        setClientNum(2)
        setCommRound(3)
        setGPU("False")
        setMode("simulation")
        setEpochs(10)
        setBatchSize(30)
        setLearningRate("1")
        setLossFunction("cross_entropy")
        setOptimizer("sdg")
        closeCreateSettingDialog()
    };
    
    // get models for dropdown menu
    const getModels = async (e) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        };

        axios.get(process.env.REACT_APP_API_URL + 'getModels', axiosConfig)
        .then((response) => {
            setModelsMenu(response.data.map((model) => <MenuItem key={model._id} value={model._id}>{model.model} with {model.library_name} </MenuItem>))
        })
        .catch((e) => {
            toast.configure()
            toast.error(e.message)
        });
    }

    // get datasets for dropdown menu
    const getDatasets = async (e) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        };
        axios.get(process.env.REACT_APP_API_URL + 'getDatasets', axiosConfig)
        .then((response) => {
            setDatasetsMenu(response.data.map((dataset) => <MenuItem key={dataset._id} value={dataset._id}>{dataset.dataset_name}</MenuItem>))
        })
        .catch((e) => {
            toast.configure()
            toast.error(e.message)
        });
    }
    
    // when the user presses submit all of their entries is grouped into a JSON object and sent to the server through a post request
    // then the state of the different attributes of the setting are reset
    const onSubmit = async (e) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        };
        let data = {
            'identifier': identifier,
            'model': setting_model,
            'dataset': dataset,
            'fedAlgo': fedAlgo,
            'clients_number': parseInt(clients_number),
            'communication_rounds': parseInt(communication_rounds),
            'GPU': GPU,
            'mode': mode,
            'batch_size': parseInt(batch_size),
            'learning_rate': "0.0" + learning_rate,
            'epochs': parseInt(epochs),
            'optimizer': optimizer,
            'loss_function': loss_function,
        };
        axios.post(process.env.REACT_APP_API_URL + 'createSetting', data, axiosConfig)
            .then((response) => {
                addSetting(response.data)
                toast.configure()
                toast.success('Setting created successfully')
            })
            .catch((e) => {
                toast.configure()
                toast.error(e.message)
            });
        setIdentifier("")
        setSettingModel("")
        setDataset("")
        setFedAlgo("fedAvg")
        setClientNum(2)
        setCommRound(3)
        setGPU("False")
        setMode("simulation")
        setEpochs(10)
        setBatchSize(30)
        setLearningRate("1")
        setLossFunction("cross_entropy")
        setOptimizer("sdg")
        closeCreateSettingDialog();
    }
    
    // JSX template
    return <Dialog open={createSettingDialogState} onClose={closeCreateSettingDialog}>
        <DialogTitle>Add an experiment setting</DialogTitle>
        <DialogContent>
            <DialogContentText className="dialog_text">
                Please enter the attributes of the experiment.
            </DialogContentText>
            <form method="post" action="#" id="#">
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeIdentifier}
                    id="identifier"
                    label="identifier"
                    className="identifier"
                    error={identifier.length > 0 ? false : true}
                    helperText={identifier.length > 0 ? false : "Please a least enter an identifier"}
                    type="text"
                    fullWidth
                    required
                />
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="model"
                    label="ML model"
                    error={setting_model.length > 0 ? false : true}
                    onOpen={getModels}
                    onChange={onInputChangeModel}
                    value={setting_model || ''}
                    fullWidth
                    required
                >
                {models_menu}
                </Select>
                <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="dataset"
                    label="dataset"
                    error={dataset.length > 0 ? false : true}
                    onOpen={getDatasets}
                    onChange={onInputChangeDataset}
                    value={dataset || ''}
                    fullWidth
                    required
                >
                {datasets_menu}
                </Select>
                <InputLabel id="demo-simple-select-label">Federated strategy</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="fedAlgo"
                    defaultValue="fedAvg"
                    label="federated strategy"
                    onChange={onInputChangeFedAlgo}
                    fullWidth
                    required
                >
                    <MenuItem value="fedAvg">fedAvg</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                </Select>
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeClientNum}
                    id="clients_number"
                    label="clients number"
                    className="clients_number"
                    type="number"
                    defaultValue={2}
                    InputProps={{
                        inputProps: {
                            max: 100000, min: 2
                        }
                    }}
                    fullWidth
                    required
                />
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeCommRound}
                    id="communication_rounds"
                    label="communication rounds"
                    className="communication_rounds"
                    type="number"
                    defaultValue={3}
                    InputProps={{
                        inputProps: {
                            max: 100, min: 0
                        }
                    }}
                    fullWidth
                    required
                />
                <InputLabel id="demo-simple-select-label">GPU</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="GPU"
                    defaultValue="False"
                    label="GPU"
                    onChange={onInputChangeGPU}
                    fullWidth
                    required
                >
                    <MenuItem value="False">False</MenuItem>
                    <MenuItem value="True">True</MenuItem>
                </Select>
                <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="mode"
                    defaultValue="simulation"
                    label="mode"
                    onChange={onInputChangeMode}
                    fullWidth
                    required
                >
                    <MenuItem value="simulation">simulation</MenuItem>
                    <MenuItem value="cross-silo">cross-silo</MenuItem>
                    <MenuItem value="cross-device">cross-device</MenuItem>
                </Select>
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeBatchSize}
                    id="batch_size"
                    label="batch size"
                    className="batch_size"
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
                    onChange={onInputChangeLearningRate}
                    id="learning_rate"
                    label="learning rate"
                    className="learning_rate"
                    type="number"
                    defaultValue={1}
                    InputProps={{
                        inputProps: {
                            max: 9, min: 1
                        }
                    }}
                    fullWidth
                    required
                />
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeEpochs}
                    id="epochs"
                    label="epochs"
                    className="epochs"
                    defaultValue={10}
                    InputProps={{
                        inputProps: {
                            max: 1000, min: 1
                        }
                    }}
                    type="number"
                    fullWidth
                    required
                />
                <InputLabel id="optimizer">optimizer</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    id="optimizer"
                    defaultValue="sgd"
                    label="optimizer"
                    onChange={onInputChangeOptimizer}
                    fullWidth
                    required
                >
                    <MenuItem value="sgd">sgd</MenuItem>
                </Select>
                <InputLabel id="loss_function">loss function</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    id="loss_function"
                    defaultValue="cross_entropy"
                    label="loss_function"
                    onChange={onInputChangeLossFunction}
                    fullWidth
                    required
                >
                    <MenuItem value="cross_entropy">cross_entropy</MenuItem>
                </Select>
                <DialogActions>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSubmit}>Add</Button>
                </DialogActions>
            </form>
        </DialogContent>

    </Dialog>
};

export default CreateSettingDialog;