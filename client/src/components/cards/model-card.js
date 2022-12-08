import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import prog from '../../assets/program.png';
import DeleteModelDialog from "../dialogs/model-dialogs/delete-model-dialog";
import useStore from "../../services/useStore";
import './card.css'

export default function ModelCard(props) {

  // initialize state to open the dialog to dialog to delete a model
  const openDeleteModelDialog = useStore((state) => state.openDeleteModelDialog);

  // save the ID and the name of the model to be deleted and open the dialog to delete the model
  const onDelete = async (e) => {
    e.preventDefault();
    localStorage.setItem('deleteModelId', props.id);
    localStorage.setItem('deleteModel', props.model + " with " + props.library_name);
    openDeleteModelDialog();
  }

  return (
    <Card className='utility-card' sx={{ width: 395, height: 395 }}>
      <CardMedia
        component="img"
        alt="model"
        className='card-image'
        image={prog}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.model} with {props.library_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Library: {props.library_name} {props.version}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Environment: {props.environment}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Name of the script: {props.script}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={onDelete} className='delete-button' size="small">Delete</Button>
      </CardActions>
      <DeleteModelDialog identifier={props.library_name} id={props._id} />
    </Card>
  );
}