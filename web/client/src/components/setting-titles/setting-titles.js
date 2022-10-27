import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './setting-titles.css';

export default function SettingTitles(props) {

  return (
    <Card className="setting" sx={{ width: 295, height: 295 }}>
      <CardContent className="setting">
        <Typography variant="body2" className="settings-title-large">identifier</Typography>
        <Typography variant="body2" className="settings-title">library</Typography>
        <Typography variant="body2" className="settings-title">version</Typography>
        <Typography variant="body2" className="settings-title">model</Typography>
        <Typography variant="body2" className="settings-title-large">strategy</Typography>
        <Typography variant="body2" className="settings-title-large">clients num</Typography>
        <Typography variant="body2" className="settings-title">dataset</Typography>
        <Typography variant="body2" className="settings-title-large">dataformat</Typography>
        <Typography variant="body2" className="settings-title-large">datasize</Typography>
        <Typography variant="body2" className="settings-title-large">datapoints</Typography>
        <Typography variant="body2" className="settings-title">GPU</Typography>
        <Typography variant="body2" className="settings-title-large">mode</Typography>
        <Typography variant="body2" className="settings-title">epochs</Typography>
        <Typography variant="body2" className="settings-title">batch size</Typography>
        <Typography variant="body2" className="settings-title">lr</Typography>
        <Typography variant="body2" className="settings-title-large">loss</Typography>
        <Typography variant="body2" className="settings-title">opt</Typography>
      </CardContent>

    </Card>
  );
}