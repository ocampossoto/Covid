import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend, ResponsiveContainer} from 'recharts';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
function convert(valueOrigin){
    var value = Math.abs(valueOrigin);
    if(value>=1000000)
    {
        value=(valueOrigin/1000000)+"M"
    }
    else if(value>=1000)
    {
        value=(valueOrigin/1000)+"K";
    }
    else{
        value = valueOrigin;
    }
    return value;
}
export default function CoungryGraphs(props){
    return( <div>
        <Grid container justify="center" spacing={1} align="center">
        <Grid item lg={12} md={12} sm={12}>
            <Typography variant="h6" component="h6">
                {props.item.name}
            </Typography>
        </Grid>
        <Grid item lg={12} style={{ minWidth: '100%' }}>
        <ResponsiveContainer height={window.innerHeight*0.5}>
                    <LineChart width={window.innerWidth*0.5} data={props.data}>
                    <Line dot={false} type="monotone" dataKey={props.item.name} stroke={props.item.color} />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis  tickFormatter={tick => {
                                return convert(tick);
                                }} />
                    <Tooltip/>
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </Grid>
        </Grid>
    </div>
    )
}
