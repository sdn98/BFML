import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteDialog from '../dialogs/deleteDialog';
import useStore from "../../services/useStore";
import './setting-card.css';

export default function SettingCard(props) {

  const openDeleteDialog = useStore((state) => state.openDeleteDialog);

  const navigate = useNavigate();
  const navigateToTrain = () => {
    navigate('/train/' + props.id);
  };
  const onDelete = async (e) => {
    e.preventDefault();
    localStorage.setItem('deleteId', props.id);
    localStorage.setItem('deleteIdentifier', props.identifier);
    openDeleteDialog();
  }

  return (
    <Card className="setting" sx={{ width: 295, height: 295 }}>
      <CardContent className="setting">
        <Typography variant="body2" className="setting-attribute-large">
        {props.identifier}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.library}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.version}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.model}
        </Typography>
        <Typography variant="body2" className="setting-attribute-large">
        {props.fedAlgo}
        </Typography>
        <Typography variant="body2" className="setting-attribute-large">
        {props.clients_number}
        </Typography>
        <Typography variant="body2" className="setting-attribute-large">
        {props.communication_rounds}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.dataset}
        </Typography>
        <Typography variant="body2" className="setting-attribute-large">
        {props.dataset_format}
        </Typography>
        <Typography variant="body2" className="setting-attribute-large">
        {props.dataset_size} MB
        </Typography>
        <Typography variant="body2" className="setting-attribute-large">
        {props.datapoints_number}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.GPU.toString()}
        </Typography>
        <Typography variant="body2" className="setting-attribute-large">
        {props.mode}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.epochs}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.batch_size}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.learning_rate}
        </Typography>
        <Typography variant="body2" className="setting-attribute-large">
        {props.loss_function}
        </Typography>
        <Typography variant="body2" className="setting-attribute">
        {props.optimizer}
        </Typography>
      </CardContent>
      <CardActions className="setting_buttons">
        <Button onClick={navigateToTrain} size="small">Train</Button>
        <Button onClick={onDelete} size="small">Delete</Button>
      </CardActions>
      <DeleteDialog identifier={props.identifier} id={props._id} />
    </Card>
  );
}