import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import HomeIcon from '@material-ui/icons/Home';
import PublicIcon from '@material-ui/icons/Public';
import { Link as RouterLink } from 'react-router-dom';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import EqualizerIcon from '@material-ui/icons/Equalizer';
export const mainListItems = (
  <div>
    <ListItem button component={RouterLink} to="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    <ListItem button component={RouterLink} to="/World">
      <ListItemIcon>
        <PublicIcon />
      </ListItemIcon>
      <ListItemText primary="World Charts" />
    </ListItem>
    <ListItem button component={RouterLink} to="/US">
      <ListItemIcon>
        <LocationOnIcon />
      </ListItemIcon>
      <ListItemText primary="US Charts" />
    </ListItem>
    <ListItem button component={RouterLink} to="/CompareCountries">
      <ListItemIcon>
        <CompareArrowsIcon />
      </ListItemIcon>
      <ListItemText primary="Compare Countries" />
    </ListItem>
    <ListItem button component={RouterLink} to="/CompareUSDeaths">
      <ListItemIcon>
        <EqualizerIcon/>
      </ListItemIcon>
      <ListItemText primary="Covid VS Deaths (US)" />
    </ListItem>
  </div>
);