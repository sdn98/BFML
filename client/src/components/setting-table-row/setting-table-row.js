import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import DeleteSettingDialog from '../dialogs/settings-dialogs/delete-setting-dialog';
import useStore from "../../services/useStore";
import './setting-table-row.css';


export default function SettingTableRow(props) {

  // state change to open the delete dialog
  const openDeleteSettingDialog = useStore((state) => state.openDeleteSettingDialog);

  // navigation to the training page of the different settings when clicking on the TRAIN button
  const navigate = useNavigate();
  const navigateToTrain = () => {
    navigate('/train/' + props.id);
  };

  // open delete dialog when the user clicks on delete
  const onDelete = async (e) => {
    e.preventDefault();
    localStorage.setItem('deleteSettingId', props.id);
    localStorage.setItem('deleteSettingIdentifier', props.identifier);
    openDeleteSettingDialog();
  }

  // JSX template
  return (
    <TableRow>
      <TableCell className="train-table-cell">{props.identifier}</TableCell>
      <TableCell className="train-table-cell">{props.library}</TableCell>
      <TableCell className="train-table-cell">{props.version}</TableCell>
      <TableCell className="train-table-cell">{props.model}</TableCell>
      <TableCell className="train-table-cell">{props.fedAlgo}</TableCell>
      <TableCell className="train-table-cell">{props.clients_number}</TableCell>
      <TableCell className="train-table-cell">{props.communication_rounds}</TableCell>
      <TableCell className="train-table-cell">{props.dataset}</TableCell>
      <TableCell className="train-table-cell">{props.GPU}</TableCell>
      <TableCell className="train-table-cell">{props.mode}</TableCell>
      <TableCell className="train-table-cell">{props.epochs}</TableCell>
      <TableCell className="train-table-cell">{props.batch_size}</TableCell>
      <TableCell className="train-table-cell">{props.learning_rate}</TableCell>
      <TableCell className="train-table-cell">{props.loss_function}</TableCell>
      <TableCell className="train-table-cell">{props.optimizer}</TableCell>
      <TableCell className="train-table-cell"><Button onClick={navigateToTrain} size="small">Train</Button></TableCell>
      <TableCell className="train-table-cell"><Button onClick={onDelete} size="small">Delete</Button></TableCell>
      <DeleteSettingDialog identifier={props.identifier} id={props._id} />
    </TableRow>
  );
}