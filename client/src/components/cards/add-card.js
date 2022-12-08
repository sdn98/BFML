import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import useStore from '../../services/useStore';
import Button from '@mui/material/Button';
import CreateDatasetDialog from '../dialogs/datasets-dialogs/create-dataset-dialog';
import CreateModelDialog from '../dialogs/model-dialogs/create-model-dialog';
import './card.css'

export default function AddCard(props) {
  
  // initialize state to open the dialogs to create a model and a dataset
  const openCreateDatasetDialog = useStore((state) => state.openCreateDatasetDialog)
  const openCreateModelDialog = useStore((state) => state.openCreateModelDialog)

  // open the respective dialog depending on the passed prop
  const onOpenDialog = () => {
    if (props.object === "dataset") {
      openCreateDatasetDialog()
    } else {
      openCreateModelDialog()
    }
  };

  return (
    <Card className="add-card" sx={{ width: 395, height: 395 }}>
      <CardContent>
        <CardActions>
          <Button className="add-card-button" onClick={onOpenDialog} size="large" color="primary">
            Add a {props.object}
          </Button>
        </CardActions>
      </CardContent>
      <CreateDatasetDialog object={props.object} />
      <CreateModelDialog object={props.object} />
    </Card>
  );
}