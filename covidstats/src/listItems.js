import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import HomeIcon from '@material-ui/icons/Home';
import PublicIcon from '@material-ui/icons/Public';
import { Link as RouterLink } from 'react-router-dom';
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
  </div>
);