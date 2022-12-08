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

export function CreateModelDialog() {

    // environment config
    dotenv.config()

    // state of the create dialog and the different attributes of the model as well as functions to control them 
    const model = useStore((state) => state.model);
    const library_name = useStore((state) => state.library_name);
    const version = useStore((state) => state.version);
    const environment = useStore((state) => state.environment);
    const script = useStore((state) => state.script);

    const createModelDialogState = useStore((state) => state.createModelDialogState);
    const closeCreateModelDialog = useStore((state) => state.closeCreateModelDialog);

    const addModel = useStore((state) => state.addModel);
    const setModel = useStore((state) => state.setModel);
    const setLibraryName = useStore((state) => state.setLibraryName);
    const setVersion = useStore((state) => state.setVersion);
    const setEnvironment = useStore((state) => state.setEnvironment);
    const setScript = useStore((state) => state.setScript);

    // functions for event change for the different input field
    const onInputChangeModel = (e) => {
        setModel(e.target.value)
    };
    const onInputChangeLibraryName = (e) => {
        setLibraryName(e.target.value)
    };
    const onInputChangeVersion = (e) => {
        setVersion(e.target.value)
    };
    const onInputChangeEnvironment = (e) => {
        setEnvironment(e.target.value)
    };
    const onInputChangeScript = (e) => {
        setScript(e.target.value)
    };

    // when the user cancels the create dialog the state of the attributes of the model is reset to initial state
    const onCancel = (e) => {
        setModel("CNN")
        setLibraryName("pysyft")
        setVersion("2.9.0")
        setEnvironment("pysyft")
        setScript("image_classifier")
        closeCreateModelDialog()
    };

    // when the user presses submit all of their entries is grouped into a JSON object and sent to the server through a post request
    // then the state of the different attributes of the model are reset
    const onSubmit = async (e) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        };
        let file = script;
        if (library_name === "fedml") {
            file = file + ".yaml";
        } else {
            file = file + ".py";
        }
        let data = {
            'model': model,
            'library_name': library_name,
            'version': version,
            'environment': environment,
            'script': file,
        };
        axios.post(process.env.REACT_APP_API_URL + 'createModel', data, axiosConfig)
            .then((response) => {
                addModel(response.data)
                toast.configure()
                toast.success('Model created successfully')
            })
            .catch((e) => {
                toast.configure()
                toast.error(e.message)
            });

        setModel("CNN")
        setLibraryName("pysyft")
        setVersion("2.9.0")
        setEnvironment("pysyft")
        setScript("image_classifier")
        closeCreateModelDialog();
    }

    // JSX template
    return <Dialog open={createModelDialogState} onClose={closeCreateModelDialog}>
        <DialogTitle>Add a Model</DialogTitle>
        <DialogContent>
            <DialogContentText className="dialog_text">
                Please enter the attributes of the Model.
            </DialogContentText>
            <form method="post" action="#" id="#">
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
                <InputLabel id="demo-simple-select-label">Library</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="library"
                    defaultValue="pysyft"
                    label="library"
                    onChange={onInputChangeLibraryName}
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
                <InputLabel id="demo-simple-select-label">Environment</InputLabel>
                <Select
                    style={{ marginBottom: '10px' }}
                    id="environment"
                    defaultValue="pysyft"
                    label="environment"
                    onChange={onInputChangeEnvironment}
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
                    onChange={onInputChangeScript}
                    id="script"
                    label="script"
                    className="script"
                    defaultValue="image_classifier"
                    error={script.length > 3 ? false : true}
                    helperText={script.length > 3 ? false : "Please enter a valid script name without extension"}
                    type="text"
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

export default CreateModelDialog;