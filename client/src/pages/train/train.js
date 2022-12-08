import React, { useEffect } from 'react';
import * as dotenv from 'dotenv'
import axios from 'axios';
import { toast } from 'react-toastify';
import './train.css';
import useStore from "../../services/useStore";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function Train(props) {

    // environment config
    dotenv.config()

    // on render get the information about the setting
    useEffect(() => {
        getSettingInfo();
    }, []);

    // state declaration
    const setting = useStore((state) => state.setting)
    const metrics = useStore((state) => state.metrics)
    const setSetting = useStore((state) => state.setSetting)
    const setMetrics = useStore((state) => state.setMetrics)

    // get requests for the setting info and the training metrics
    const getSettingInfo = async (e) => {
        const axiosConfig = {
            Headers: {
                "Content-Type": "application/json",
            },
        };

        await axios
            .get(process.env.REACT_APP_API_URL + 'getSetting/' + window.location.pathname.substring(7), axiosConfig)
            .then((res) => {
                console.log(res.data)
                setSetting(res.data)
            })
            .catch((e) => {
                toast.configure()
                toast.error('Error getting the benchmarking data')
            })

        await axios.get(process.env.REACT_APP_API_URL + 'trainSetting/' + window.location.pathname.substring(7), axiosConfig)
            .then((res) => {
                setMetrics(res.data.metrics)
            })
            .catch((e) => {
                toast.configure()
                toast.error('Error getting the benchmarking data')
            })
    }

    // JSX template
    return (
        <div className="train-page">
            <h1 className="train-status-title">Benchmarking results for {setting.identifier}</h1>
            <h2 className="train-status-subtitle">General</h2>
            <TableContainer component={Paper}>
                <Table className="train-table" sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead className="train-table-head">
                        <TableRow>
                            <TableCell className="train-table-head-cell">Library</TableCell>
                            <TableCell className="train-table-head-cell">Version</TableCell>
                            <TableCell className="train-table-head-cell">Environment</TableCell>
                            <TableCell className="train-table-head-cell">Model</TableCell>
                            <TableCell className="train-table-head-cell">Script</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className="train-table-cell">{setting.library}</TableCell>
                            <TableCell className="train-table-cell">{setting.version}</TableCell>
                            <TableCell className="train-table-cell">{setting.environment}</TableCell>
                            <TableCell className="train-table-cell">{setting.model}</TableCell>
                            <TableCell className="train-table-cell">{setting.script}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <h2 className="train-status-subtitle">Model</h2>
            <TableContainer component={Paper}>
                <Table className="train-table" sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead className="train-table-head">
                        <TableRow>
                            <TableCell className="train-table-head-cell">Federated Strategy</TableCell>
                            <TableCell className="train-table-head-cell">Communication Rounds</TableCell>
                            <TableCell className="train-table-head-cell">GPU</TableCell>
                            <TableCell className="train-table-head-cell">Mode</TableCell>
                            <TableCell className="train-table-head-cell">Epochs</TableCell>
                            <TableCell className="train-table-head-cell">Batches</TableCell>
                            <TableCell className="train-table-head-cell">Learning Rate</TableCell>
                            <TableCell className="train-table-head-cell">Loss</TableCell>
                            <TableCell className="train-table-head-cell">Optimizer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className="train-table-cell"> {setting.fedAlgo}</TableCell>
                            <TableCell className="train-table-cell"> {setting.communication_rounds}</TableCell>
                            <TableCell className="train-table-cell">{String(setting.GPU)}</TableCell>
                            <TableCell className="train-table-cell">{setting.mode}</TableCell>
                            <TableCell className="train-table-cell">{setting.epochs}</TableCell>
                            <TableCell className="train-table-cell">{setting.batch_size}</TableCell>
                            <TableCell className="train-table-cell"> {setting.learning_rate}</TableCell>
                            <TableCell className="train-table-cell">{setting.loss_function}</TableCell>
                            <TableCell className="train-table-cell">{setting.optimizer}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <h2 className="train-status-subtitle">Dataset</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="train-table-head-cell">Dataset</TableCell>
                            <TableCell className="train-table-head-cell">Number of Clients</TableCell>
                            <TableCell className="train-table-head-cell">Number of Datapoints</TableCell>
                            <TableCell className="train-table-head-cell">Datasize</TableCell>
                            <TableCell className="train-table-head-cell">Datapoint / Client</TableCell>
                            <TableCell className="train-table-head-cell">Datasize / Client</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className="train-table-cell">{setting.dataset}</TableCell>
                            <TableCell className="train-table-cell">{setting.clients_number}</TableCell>
                            <TableCell className="train-table-cell">{setting.datapoints_number}</TableCell>
                            <TableCell className="train-table-cell">{setting.dataset_size} MB</TableCell>
                            <TableCell className="train-table-cell">{String(setting.datapoints_number / setting.clients_number)}</TableCell>
                            <TableCell className="train-table-cell">{String(setting.dataset_size / setting.clients_number)} MB</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <h2 className="train-status-subtitle">Performance and Efficiency</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="train-table-head-cell">Time of Execution</TableCell>
                            <TableCell className="train-table-head-cell">CPU</TableCell>
                            <TableCell className="train-table-head-cell">GPU</TableCell>
                            <TableCell className="train-table-head-cell">Memory</TableCell>
                            <TableCell className="train-table-head-cell">Network</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className="train-table-cell">{metrics.time}</TableCell>
                            <TableCell className="train-table-cell">{metrics.cpu}</TableCell>
                            <TableCell className="train-table-cell">{metrics.gpu}</TableCell>
                            <TableCell className="train-table-cell">{metrics.memory}</TableCell>
                            <TableCell className="train-table-cell">{metrics.network} </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <h2 className="train-status-subtitle">Accuracy</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="train-table-head-cell">Accuracy</TableCell>
                            <TableCell className="train-table-head-cell">Loss</TableCell>
                            <TableCell className="train-table-head-cell">Precision</TableCell>
                            <TableCell className="train-table-head-cell">Recall</TableCell>
                            <TableCell className="train-table-head-cell">F1</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className="train-table-cell">{metrics.accuracy}</TableCell>
                            <TableCell className="train-table-cell">{metrics.loss}</TableCell>
                            <TableCell className="train-table-cell">{metrics.precision}</TableCell>
                            <TableCell className="train-table-cell">{metrics.recall}</TableCell>
                            <TableCell className="train-table-cell">{metrics.fone} </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};


export default Train;