import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Home from './Home';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CompareCountries from './compareCountries';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Navigation from './navigation';
// import WorldCharts from './WorldCharts';
// import USView from './USView';
import CompareUSDeaths from './CompareUSDeaths';
const USView = React.lazy(() => import('./USView'));
const WorldCharts = React.lazy(() => import('./WorldCharts'));


const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
      flexShrink: 0,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
 

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
   <div className={classes.root}>
      <CssBaseline />
      <Router>
        <Navigation/>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3} justify="center">
                  <Switch>
                      <Route exact path="/">
                      <Grid item xs={12} md={8} lg={9}>
                          <Paper>
                              <Home/>
                          </Paper>
                      </Grid>
                      </Route>
                      <Route exact path="/World">
                          <Grid item xs={12} md={11} lg={11}>
                              <Paper>
                                  <WorldCharts/>
                              </Paper>
                          </Grid>
                      </Route>
                      <Route exact path="/US">
                          <Grid item xs={12} md={11} lg={11}>
                              <Paper>
                                  <USView/>
                              </Paper>
                          </Grid>
                      </Route>
                      <Route exact path="/CompareCountries">
                          <Grid item xs={12} md={11} lg={11}>
                              <Paper>
                                  <CompareCountries/>
                              </Paper>
                          </Grid>
                      </Route>
                      <Route exact path="/CompareUSDeaths">
                          <Grid item xs={12} md={11} lg={11}>
                              <Paper>
                                  <CompareUSDeaths/>
                              </Paper>
                          </Grid>
                      </Route>
                  </Switch>
            </Grid>
          </Container>
      </main>
      </Router>
    </div> 
    </MuiPickersUtilsProvider>
  );
}