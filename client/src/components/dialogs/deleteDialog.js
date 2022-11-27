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
import useStore from "../../services/useStore";

export function DeleteDialog(props) {

    // environment config
    dotenv.config()

    // state of the delete dialog as well as the state functions to close it and to remove a setting from the array of settings
    const deleteDialogState = useStore((state) => state.deleteDialogState);
    const closeDeleteDialog = useStore((state) => state.closeDeleteDialog);
    const removeSetting = useStore((state) => state.removeSetting);

    // revert the changes made when the user clicks on DELETE when the user clicks on cancel
    const onCancel = async (e) => {
        e.preventDefault();
        localStorage.removeItem('deleteId');
        localStorage.removeItem('deleteIdentifier');
        closeDeleteDialog();
    }

    // DELETE http request to delete a setting from the database
    const deleteSetting = async (e) => {
        e.preventDefault();
        let settingToBeRemoved = localStorage.getItem('deleteId');
        const config = {
            Headers: {
                "Content-Type": "application/json",
            },
        };
        await axios.delete(process.env.REACT_APP_API_URL +'deleteSetting/' + settingToBeRemoved, config)
            .then(
                removeSetting(settingToBeRemoved),
                toast.configure(),
                toast.success('setting deleted successfully'),
            )
            .catch((e) => {
                toast.configure()
                toast.error('Error deleting the setting')
            });
        localStorage.removeItem('deleteId');
        localStorage.removeItem('deleteIdentifier');
        closeDeleteDialog();
    }

    // JSX template
    return <Dialog key={props.id} open={deleteDialogState} onClose={closeDeleteDialog}>
        <DialogTitle>Delete {localStorage.getItem('deleteIdentifier')}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you would like to delete this setting ?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={deleteSetting}>Delete</Button>
        </DialogActions>
    </Dialog>
};

export default DeleteDialog;
