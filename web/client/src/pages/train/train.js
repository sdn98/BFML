import React, { useEffect } from 'react';
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

    useEffect(() => {
        getSettingInfo();
    }, []);
    const setSetting = useStore((state) => state.setSetting)
    const setting = useStore((state) => state.setting)
    const trained = useStore((state) => state.trained)
    const setTrained = useStore((state) => state.setTrained)
    const getSettingInfo = async (e) => {
        const axiosConfig = {
            Headers: {
                "Content-Type": "application/json",
            },
        };
    
        await axios
            .get('http://localhost:5000/api/settings/getSetting/' + window.location.pathname.substring(7), axiosConfig)
            .then((res) => {
                setSetting(res.data)
            })
            .catch((e) => {
                toast.configure()
                toast.error('Error getting the benchmarking data')
            })

        await axios.get('http://localhost:5000/api/settings/trainSetting/' + window.location.pathname.substring(7), axiosConfig)
            .then((res) => {
                setTrained(res.data.metrics)  
            })
            .catch((e) => {
                toast.configure()
                toast.error('Error getting the benchmarking data')
            })
    }

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
                            <TableCell className="train-table-head-cell">Folder</TableCell>
                            <TableCell className="train-table-head-cell">Script</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className="train-table-cell">{setting.library}</TableCell>
                            <TableCell className="train-table-cell">{setting.version}</TableCell>
                            <TableCell className="train-table-cell">{setting.environment}</TableCell>
                            <TableCell className="train-table-cell">{setting.folder}</TableCell>
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
                            <TableCell className="train-table-head-cell">Model</TableCell>
                            <TableCell className="train-table-head-cell">Federated Strategy</TableCell>
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
                            <TableCell className="train-table-cell">{setting.model}</TableCell>
                            <TableCell className="train-table-cell"> {setting.fedAlgo}</TableCell>
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
            <h2 className="train-status-subtitle">Performance, Efficiency, and Accuracy</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="train-table-head-cell">Time of Execution</TableCell>
                            <TableCell className="train-table-head-cell">CPU</TableCell>
                            <TableCell className="train-table-head-cell">Memory</TableCell>
                            <TableCell className="train-table-head-cell">Network</TableCell>
                            <TableCell className="train-table-head-cell">Accuracy</TableCell>
                            <TableCell className="train-table-head-cell">Loss</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className="train-table-cell">{trained.time}</TableCell>
                            <TableCell className="train-table-cell">{trained.cpu}</TableCell>
                            <TableCell className="train-table-cell">{trained.memory}</TableCell>
                            <TableCell className="train-table-cell">{trained.network} </TableCell>
                            <TableCell className="train-table-cell">{trained.accuracy}</TableCell>
                            <TableCell className="train-table-cell">{trained.loss} </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <h2 className="train-status-subtitle">Model Evaluation</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableBody>
                        <TableRow >
                            <TableCell className="train-table-head-cell">Classes</TableCell>
                            {(() => {
                                let classes = [];
                                if (trained.classes === undefined) {
                                    return <TableCell className="train-table-head-cell">Still loading...</TableCell>;
                                } else {
                                    for (let i = 0; i < trained.classes.length; i++) {
                                        classes.push(<TableCell key={i} className="train-table-cell">{trained.classes[i]}</TableCell>);
                                    }
                                    console.log('confusion matrix')    
                                    console.log(trained.matrix)  
                                    return classes;
                                }
                            })()}
                        </TableRow>
                        <TableRow >
                            <TableCell className="train-table-head-cell">Precision</TableCell>
                            {(() => {
                                let precision = [];
                                if (trained.precision === undefined) {
                                    return <TableCell className="train-table-head-cell">Still loading...</TableCell>;
                                } else {
                                    for (let i = 0; i < trained.precision.length; i++) {
                                        precision.push(<TableCell key={i} className="train-table-cell">{trained.precision[i]}</TableCell>);
                                    }
                                    return precision;
                                }
                            })()}
                        </TableRow>
                        <TableRow >
                            <TableCell className="train-table-head-cell">Recall</TableCell>
                            {(() => {
                                let recall = [];
                                if (trained.recall === undefined) {
                                    return <TableCell className="train-table-head-cell">Still loading...</TableCell>;
                                } else {
                                    for (let i = 0; i < trained.recall.length; i++) {
                                        recall.push(<TableCell key={i} className="train-table-cell">{trained.recall[i]}</TableCell>);
                                    }
                                    return recall;
                                }
                            })()}
                        </TableRow>
                        <TableRow >
                            <TableCell className="train-table-head-cell">F1</TableCell>
                            {(() => {
                                let fone = [];
                                if (trained.fone === undefined) {
                                    return <TableCell className="train-table-head-cell">Still loading...</TableCell>;
                                } else {
                                    for (let i = 0; i < trained.fone.length; i++) {
                                        fone.push(<TableCell key={i} className="train-table-cell">{trained.fone[i]}</TableCell>);
                                    }
                                    return fone;
                                }
                            })()}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>            
        </div>
    );
};


export default Train;