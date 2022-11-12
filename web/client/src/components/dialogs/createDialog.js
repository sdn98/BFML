import * as React from 'react';
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
import useStore from "../../services/useStore";



export function CreateDialog() {

    const createDialogState = useStore((state) => state.createDialogState);
    const identifier = useStore((state) => state.identifier);
    const library = useStore((state) => state.library);
    const version = useStore((state) => state.version);
    const model = useStore((state) => state.model);
    const fedAlgo = useStore((state) => state.fedAlgo);
    const clients_number = useStore((state) => state.clients_number);
    const communication_rounds = useStore((state) => state.communication_rounds);
    const dataset = useStore((state) => state.dataset);
    const dataset_url = useStore((state) => state.dataset_url);
    const dataset_format = useStore((state) => state.dataset_format);
    const dataset_size = useStore((state) => state.dataset_size);
    const datapoints_number = useStore((state) => state.datapoints_number);
    const GPU = useStore((state) => state.GPU);
    const mode = useStore((state) => state.mode);
    const batch_size = useStore((state) => state.batch_size);
    const learning_rate = useStore((state) => state.learning_rate);
    const epochs = useStore((state) => state.epochs);
    const optimizer = useStore((state) => state.optimizer);
    const loss_function = useStore((state) => state.loss_function);
    const environment = useStore((state) => state.environment);
    const folder = useStore((state) => state.folder);
    const script = useStore((state) => state.script);

    const closeCreateDialog = useStore((state) => state.closeCreateDialog);
    const addSetting = useStore((state) => state.addSetting);
    const setIdentifier = useStore((state) => state.setIdentifier);
    const setLibrary = useStore((state) => state.setLibrary);
    const setVersion = useStore((state) => state.setVersion);
    const setModel = useStore((state) => state.setModel);
    const setFedAlgo = useStore((state) => state.setFedAlgo);
    const setClientNum = useStore((state) => state.setClientNum);
    const setCommRound = useStore((state) => state.setCommRound);
    const setDataset = useStore((state) => state.setDataset);
    const setDatasetURL = useStore((state) => state.setDatasetURL);
    const setDatasetFormat = useStore((state) => state.setDatasetFormat);
    const setDatasetSize = useStore((state) => state.setDatasetSize);
    const setDatapointsNum = useStore((state) => state.setDatapointsNum);
    const setGPU = useStore((state) => state.setGPU);
    const setMode = useStore((state) => state.setMode);
    const setEpochs = useStore((state) => state.setEpochs);
    const setBatchSize = useStore((state) => state.setBatchSize);
    const setLearningRate = useStore((state) => state.setLearningRate);
    const setLossFunction = useStore((state) => state.setLossFunction);
    const setOptimizer = useStore((state) => state.setOptimizer);
    const setEnvironment = useStore((state) => state.setEnvironment);
    const setFolder = useStore((state) => state.setFolder);
    const setScript = useStore((state) => state.setScript);

    const onInputChangeIdentifier = (e) => {
        setIdentifier(e.target.value)
    };
    const onInputChangeLibrary = (e) => {
        setLibrary(e.target.value)
    };
    const onInputChangeVersion = (e) => {
        setVersion(e.target.value)
    };
    const onInputChangeModel = (e) => {
        setModel(e.target.value)
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
    const onInputChangeDataset = (e) => {
        setDataset(e.target.value)
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
    const onInputChangeEnvironment = (e) => {
        setEnvironment(e.target.value)
    };
    const onInputChangeFolder = (e) => {
        setFolder(e.target.value)
    };
    const onInputChangeScript = (e) => {
        setScript(e.target.value)
    };
    const onCancel = (e) => {
        setIdentifier("")
        setLibrary("pysyft")
        setVersion("0.2.9")
        setModel("CNN")
        setFedAlgo("fedAvg")
        setClientNum(2)
        setCommRound(3)
        setDataset("MNIST")
        setDatasetURL("/mnist")
        setDatasetFormat("img")
        setDatasetSize(30)
        setDatapointsNum(70000)
        setGPU(false)
        setMode("simulation")
        setEpochs(10)
        setBatchSize(30)
        setLearningRate("1")
        setLossFunction("cross_entropy")
        setOptimizer("sdg")
        setEnvironment("syft")
        setFolder("pysyft")
        setScript("image_classifier_cnn.py")
        closeCreateDialog()
    };
    const onSubmit = async (e) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        };
        let data = {
            'identifier': identifier,
            'library': library,
            'version': version,
            'model': model,
            'fedAlgo': fedAlgo,
            'clients_number': parseInt(clients_number),
            'communication_rounds': parseInt(communication_rounds),
            'dataset': dataset,
            'dataset_url': "../../data" + dataset_url,
            'dataset_format': dataset_format,
            'dataset_size': parseInt(dataset_size),
            'datapoints_number': parseInt(datapoints_number),
            'GPU': Boolean(GPU),
            'mode': mode,
            'batch_size': parseInt(batch_size),
            'learning_rate': "0.0" + learning_rate,
            'epochs': parseInt(epochs),
            'optimizer': optimizer,
            'loss_function': loss_function,
            'environment': environment,
            'folder': folder,
            'script': script
        };
        axios.post('http://localhost:5000/api/settings/createSetting', data, axiosConfig)
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
        setLibrary("pysyft")
        setVersion("0.2.9")
        setModel("CNN")
        setFedAlgo("fedAvg")
        setClientNum(2)
        setCommRound(2)
        setDataset("MNIST")
        setDatasetURL("/mnist")
        setDatasetFormat("img")
        setDatasetSize(30)
        setDatapointsNum(70000)
        setGPU(false)
        setMode("simulation")
        setEpochs(10)
        setBatchSize(30)
        setLearningRate("1")
        setLossFunction("cross_entropy")
        setOptimizer("sdg")
        setEnvironment("syft")
        setFolder("pysyft")
        setScript("image_classifier_cnn.py")
        closeCreateDialog();
    }
    return <Dialog open={createDialogState} onClose={closeCreateDialog}>
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
                <InputLabel id="demo-simple-select-label">Library</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="library"
                    defaultValue="pysyft"
                    label="library"
                    onChange={onInputChangeLibrary}
                    fullWidth
                    required
                >
                    <MenuItem value="pysyft">pysyft</MenuItem>
                    <MenuItem value="ibm">ibm</MenuItem>
                    <MenuItem value="fedml">fedml</MenuItem>
                    <MenuItem value="flower">flower</MenuItem>
                    <MenuItem value="pytorch">pytorch</MenuItem>
                </Select>
                <TextField
                    style={{ marginBottom: '10px' }}
                    autoFocus
                    onChange={onInputChangeVersion}
                    id="version"
                    label="version"
                    className="version"
                    defaultValue={"0.2.9"}
                    error={/^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(version) ? false : true}
                    helperText={/^(\d+\.)?(\d+\.)?(\*|\d+)$/.test(version) ? false : "Please enter a valid version number 0.0.0"}
                    type="text"
                    fullWidth
                    required
                />
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="model"
                    defaultValue="CNN"
                    label="ML model"
                    onChange={onInputChangeModel}
                    fullWidth
                    required
                >
                    <MenuItem value="CNN">CNN</MenuItem>
                    <MenuItem value="RNN">RNN</MenuItem>
                    <MenuItem value="LSTM">LSTM</MenuItem>
                    <MenuItem value="Kmean">Kmean</MenuItem>
                    <MenuItem value="Tree">Tree</MenuItem>
                    <MenuItem value="LogReg">LogReg</MenuItem>
                    <MenuItem value="LinReg">LinReg</MenuItem>
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
                <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="dataset"
                    defaultValue="MNIST"
                    label="dataset"
                    onChange={onInputChangeDataset}
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
                <InputLabel id="demo-simple-select-label">GPU</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="GPU"
                    defaultValue="false"
                    label="GPU"
                    onChange={onInputChangeGPU}
                    fullWidth
                    required
                >
                    <MenuItem value="false">false</MenuItem>
                    <MenuItem value="true">true</MenuItem>
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
                <InputLabel id="demo-simple-select-label">Environment</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="environment"
                    defaultValue="syft"
                    label="environment"
                    onChange={onInputChangeEnvironment}
                    fullWidth
                    required
                >
                    <MenuItem value="syft">syft</MenuItem>
                    <MenuItem value="ibm">ibm</MenuItem>
                    <MenuItem value="fedml">fedml</MenuItem>
                    <MenuItem value="flower">flower</MenuItem>
                    <MenuItem value="pytorch">pytorch</MenuItem>
                </Select>
                <InputLabel id="demo-simple-select-label">Folder</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="folder"
                    defaultValue="pysyft"
                    label="folder"
                    onChange={onInputChangeFolder}
                    fullWidth
                    required
                >
                    <MenuItem value="pysyft">pysyft</MenuItem>
                    <MenuItem value="ibm">ibm</MenuItem>
                    <MenuItem value="fedml">fedml</MenuItem>
                    <MenuItem value="flower">flower</MenuItem>
                    <MenuItem value="centralized">centralized</MenuItem>
                </Select>
                <InputLabel id="demo-simple-select-label">Script</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="script"
                    defaultValue="image_classifier_cnn.py"
                    label="script"
                    onChange={onInputChangeScript}
                    fullWidth
                    required
                >
                    <MenuItem value="image_classifier_cnn.py">image_classifier_cnn.py</MenuItem>
                    <MenuItem value="image_classifier_logreg.py">image_classifier_logreg.py</MenuItem>
                    <MenuItem value="image_classifier.py">image_classifier.py</MenuItem>
                    <MenuItem value="image_classifier_cnn_server.py">image_classifier_cnn_server.py</MenuItem>

                </Select>
                <DialogActions>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSubmit}>Add</Button>
                </DialogActions>
            </form>
        </DialogContent>

    </Dialog>
};

export default CreateDialog;