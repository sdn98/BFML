import * as React from 'react';
import * as dotenv from 'dotenv'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from "../../../services/useStore";

export function DeleteDatasetDialog(props) {

    // environment config
    dotenv.config()

    // state of the delete dialog as well as the state functions to close it and to remove a dataset from the array of datasets
    const deleteDatasetDialogState = useStore((state) => state.deleteDatasetDialogState);
    const closeDeleteDatasetDialog = useStore((state) => state.closeDeleteDatasetDialog);
    const removeDataset = useStore((state) => state.removeDataset);

    // revert the changes made when the user clicks on DELETE when the user clicks on cancel
    const onCancel = async (e) => {
        e.preventDefault();
        localStorage.removeItem('deleteDatasetId');
        localStorage.removeItem('deleteDatasetName');
        closeDeleteDatasetDialog();
    }

    // DELETE http request to delete a dataset from the database
    const deleteDataset = async (e) => {
        e.preventDefault();
        let datasetToBeRemoved = localStorage.getItem('deleteDatasetId');
        const config = {
            Headers: {
                "Content-Type": "application/json",
            },
        };
        await axios.delete(process.env.REACT_APP_API_URL + 'deleteDataset/' + datasetToBeRemoved, config)
            .then(
                removeDataset(datasetToBeRemoved),
                toast.configure(),
                toast.success('dataset deleted successfully'),
            )
            .catch((e) => {
                toast.configure()
                toast.error('Error deleting the dataset')
            });
        localStorage.removeItem('deleteDatasetId');
        localStorage.removeItem('deleteDatasetName');
        closeDeleteDatasetDialog();
    }

    // JSX template
    return <Dialog key={props.id} open={deleteDatasetDialogState} onClose={closeDeleteDatasetDialog}>
        <DialogTitle>Delete {localStorage.getItem('deleteDatasetName')}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you would like to delete this dataset ?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={deleteDataset}>Delete</Button>
        </DialogActions>
    </Dialog>
};

export default DeleteDatasetDialog;