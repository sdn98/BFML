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

export function DeleteModelDialog(props) {

    // environment config
    dotenv.config()

    // state of the delete dialog as well as the state functions to close it and to remove a model from the array of models
    const deleteModelDialogState = useStore((state) => state.deleteModelDialogState);
    const closeDeleteModelDialog = useStore((state) => state.closeDeleteModelDialog);
    const removeModel = useStore((state) => state.removeModel);

    // revert the changes made when the user clicks on DELETE when the user clicks on cancel
    const onCancel = async (e) => {
        e.preventDefault();
        localStorage.removeItem('deleteModelId');
        localStorage.removeItem('deleteModel');
        closeDeleteModelDialog();
    }

    // DELETE http request to delete a model from the database
    const deleteModel = async (e) => {
        e.preventDefault();
        let modelToBeRemoved = localStorage.getItem('deleteModelId');
        const config = {
            Headers: {
                "Content-Type": "application/json",
            },
        };
        await axios.delete(process.env.REACT_APP_API_URL + 'deleteModel/' + modelToBeRemoved, config)
            .then(
                removeModel(modelToBeRemoved),
                toast.configure(),
                toast.success('model deleted successfully'),
            )
            .catch((e) => {
                toast.configure()
                toast.error('Error deleting the model')
            });
        localStorage.removeItem('deleteModelId');
        localStorage.removeItem('deleteModel');
        closeDeleteModelDialog();
    }

    // JSX template
    return <Dialog key={props.id} open={deleteModelDialogState} onClose={closeDeleteModelDialog}>
        <DialogTitle>Delete {localStorage.getItem('deleteModel')}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you would like to delete this model ?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={deleteModel}>Delete</Button>
        </DialogActions>
    </Dialog>
};

export default DeleteModelDialog;