import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import data from '../../assets/dataset.png'
import useStore from "../../services/useStore";
import DeleteDatasetDialog from "../../components/dialogs/datasets-dialogs/delete-dataset-dialog"
import './card.css'

export default function DatasetCard(props) {

  // initialize state to open the dialog to dialog to delete a dataset
  const openDeleteDatasetDialog = useStore((state) => state.openDeleteDatasetDialog);

  // save the ID and the name of the dataset to be deleted and open the dialog to delete a dataset
  const onDelete = async (e) => {
    e.preventDefault();
    localStorage.setItem('deleteDatasetId', props.id);
    localStorage.setItem('deleteDatasetName', props.dataset_name);
    openDeleteDatasetDialog();
  }

  return (
    <Card className='utility-card' sx={{ width: 395, height: 395 }}>
      <CardMedia
        component="img"
        alt="dataset"
        className='card-image'
        image={data}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.dataset_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Format: {props.dataset_format}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Size: {props.dataset_size} MB
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Number of datapoints: {props.datapoints_number}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={onDelete} className='delete-button' size="small">Delete</Button>
      </CardActions>
      <DeleteDatasetDialog identifier={props.dataset_name} id={props._id} />
    </Card>
  );
}