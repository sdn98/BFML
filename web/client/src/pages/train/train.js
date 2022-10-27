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
    const trained = useStore((state) => state.trained)
    const setTrained = useStore((state) => state.setTrained)
    const getSettingInfo = async (e) => {
        const axiosConfig = {
            Headers: {
                "Content-Type": "application/json",
            },
        };
        console.log(window.location.pathname.substring(7))
        await axios
        .get('http://localhost:5000/api/settings/getSetting/' + window.location.pathname.substring(7), axiosConfig)
        .then((res) => {              
            setSetting(res.data)
        })
        .catch((e) => {
            toast.configure()
            toast.error('Error getting the benchmarking data')
        })
        setSetting("")

        await axios.post('http://localhost:5000/api/settings/trainSetting/' + window.location.pathname.substring(7), axiosConfig)
            .then((res) => {
                setTrained(res.data.Trained.identifier)
            })
            .catch((e) => {
                toast.configure()
                toast.error('Error getting the benchmarking data')
            })
    }

    return (
        <div className="train-page">
            <h1 className="train-status-title">Benchmarking results for {trained}</h1>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Performance</TableCell>
            <TableCell>Accuracy</TableCell>
            <TableCell>Efficiency</TableCell>
            <TableCell>Scalability</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
              <TableCell>100 minutes</TableCell>
              <TableCell>0.98</TableCell>
              <TableCell>1GB</TableCell>
              <TableCell>2 clients</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    );
};


export default Train;