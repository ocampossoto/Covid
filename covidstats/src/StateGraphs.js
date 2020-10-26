import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend, ResponsiveContainer} from 'recharts';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
export default function StateGraphs(props) {
    return( <div>
         <Grid container justify="center" spacing={3} align="center">
            <Grid item lg={12} md={12} sm={12}>
                <Typography variant="h6" component="h6">
                    {props.item.name}
                </Typography>
            </Grid>
            <Grid item lg={12} style={{ minWidth: '95%' }}>
                <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={props.data}margin={{top: 16,right: 16,bottom: 0,left: 24,}}>
                        <Line type="monotone" dataKey={props.item.name} stroke={props.item.color} />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
        </Grid>
    </div>
    )
}

