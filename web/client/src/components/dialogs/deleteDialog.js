import * as React from 'react';
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

    const deleteDialogState = useStore((state) => state.deleteDialogState);
    const closeDeleteDialog = useStore((state) => state.closeDeleteDialog);
    const removeSetting = useStore((state) => state.removeSetting);

    const onCancel = async (e) => {
        e.preventDefault();
        localStorage.removeItem('deleteId');
        localStorage.removeItem('deleteIdentifier');
        closeDeleteDialog();
    }

    const deleteSetting = async (e) => {
        e.preventDefault();
        let settingToBeRemoved = localStorage.getItem('deleteId');
        const config = {
            Headers: {
                "Content-Type": "application/json",
            },
        };
        await axios.delete('http://localhost:5000/api/settings/deleteSetting/' + settingToBeRemoved, config)
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
