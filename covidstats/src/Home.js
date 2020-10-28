import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {useHistory} from "react-router-dom";
import { Button } from '@material-ui/core';
export default function Home(){
    const history = useHistory();
    return <div>
        <Grid container justify="center" spacing={2} align="center" width="90%">
            <Grid item style={{marginRigh: "2%"}}>
                <Typography variant="h5" component="h5">Welcome</Typography>
                
            </Grid>
            <Grid item lg={12} md={12} sm={12}>
                <Typography variant="body1" gutterBottom >
                    The goal of this site is to show how each country is dealing with COVID-19. As well as focusing on the data for the United States.
                </Typography>
            </Grid>
            <Grid item lg={10} md={11} sm={11}>
                <Typography variant="body1" paragraph={true} >
                Data is being pulled from <a href="https://github.com/pomber/covid19">https://github.com/pomber/covid19</a> for world data. Which is converting data from here <a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a> into a Json file. Which same source for the US data. 
                Along with modifiying some 2018 population data from <a href="https://datahub.io/core/population">https://datahub.io/core/population</a> and Google search for some countries that were not on the list. 
                </Typography>
            </Grid>
            <Grid item lg={10} md={12} sm={12}>
                <Typography variant="body1">To view the visualizations select an option from the menu on the left</Typography>
            </Grid>
            <Grid item lg={12}>
                <Button variant="contained" onClick={() => history.push("/World")}>World Charts</Button>
            </Grid>
            <Grid item lg={12}>
                <Button  variant="contained"onClick={() => history.push("/US")}>US Charts</Button>
            </Grid>
            <Grid item lg={12}>
                <Button  variant="contained"onClick={() => history.push("/CompareCountries")}>Compare Countries</Button>
            </Grid>
        </Grid>
    </div>
}