import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend, ResponsiveContainer} from 'recharts';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import population from './population.json';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import Grid from '@material-ui/core/Grid';
import {DatePicker} from '@material-ui/pickers';

const CustomToolTip = props => {
    const { active, payload, label } = props;
    if (!active || !payload) {
      return null;
    }
    return (
      <div
        style={{backgroundColor: "white"}}
      >
        <p>
          <strong>{label}</strong>
        </p>
        {payload.map((item, i) => (
          <p key={i}>
            {item.name}: <strong>{item.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  };
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
export default function WorldCharts(){
    const [allData, setAllData] = React.useState([]);
    const [keys, setKeys] = React.useState([]);
    const [key, setKey] = React.useState("US");
    const [data, setData] = React.useState([]);
    const currenDate = new Date();
    const defaultStart = new Date().setMonth(new Date().getMonth()-6);
    const [startDate, setStartDate] = React.useState(defaultStart);
    const [endDate, setEndDate] = React.useState(currenDate);
    React.useEffect(() =>{
        var url = "https://pomber.github.io/covid19/timeseries.json";
        fetch(url).then(res=> res.json()).then((result)=>{  
        var keys = Object.keys(result);
        var tempCountries = []
        keys.forEach(element => {
            tempCountries.push({value: element, label: element});
        })
        setAllData(result);
        setKeys(keys);
        
        })
    },[]);
    React.useEffect(()=>{
        if(allData[key] === undefined){
            return;
        }
        var data= allData[key];
        var ResultData = []
        for(var i = 0; i < data.length; i++){
            var tempDate = new Date(data[i].date);
            if(tempDate >= startDate && tempDate <= endDate){
                var element = {};
                if(i > 0){
                    var date = tempDate.getMonth()+1 +"/" + tempDate.getDate()+"/"+tempDate.getFullYear().toString().substr(-2);
                    element["name"] = date;
                    element["Recovered"] = data[i].recovered;
                    element["Confrimed"] = data[i].confirmed;
                    element["Deaths"] = data[i].deaths;
                    element["Deaths Per Day"] = data[i].deaths - data[i-1].deaths;
                    element["Confrimed Per Day"] = data[i].confirmed - data[i-1].confirmed;
                    element["Recovered Per Day"] = data[i].recovered - data[i-1].recovered;
        
                //   element["Recovered False"] = data[i].recovered - data[i].recovered*this.state.falsePositives;
                //   element["Confrimed False"] = data[i].confirmed - data[i].confirmed*this.state.falsePositives;
                //   element["Deaths False"] = data[i].deaths - data[i].deaths*this.state.falsePositives;
                //   element["Deaths Per Day False"] = (data[i].deaths-data[i].deaths*this.state.falsePositives) - (data[i-1].deaths - data[i-1].deaths*this.state.falsePositives);
                //   element["Confrimed Per Day False"] = (data[i].confirmed-data[i].confirmed*this.state.falsePositives) - (data[i-1].confirmed - data[i-1].confirmed*this.state.falsePositives);
                //   element["Recovered Per Day False"] = (data[i].recovered-data[i].recovered*this.state.falsePositives) - (data[i-1].recovered -data[i-1].recovered*this.state.falsePositives);
                }
                else{
                element["Deaths Per Day"] = 0;
                element["Confrimed Per Day"] = 0;
                element["Recovered Per Day"] = 0;
                }
                ResultData.push(element);
            }
        }
        setData(ResultData)
    },[allData, key,startDate, endDate])
    return <div>
        <Grid container justify="center" spacing={3} align="center">
            <Grid item lg={12}>
                <Typography variant="h4" component="h4">
                    Covid-19 in {key}. Population: <NumberFormat value={population[key]} displayType={'text'} thousandSeparator={true} renderText={value => <>{value}</>} />
                </Typography>
            </Grid>
            <Grid item lg={12} style={{ minWidth: '95%' }}>
                <Autocomplete
                    options={keys}
                    value={key}
                    onChange={(e, val) => setKey(val)}
                    renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
                />
            </Grid>
            <Grid item lg={6}>
                <DatePicker animateYearScrolling value={startDate} onChange={setStartDate} label="Start Date" minDate={new Date("2019-12-2")} variant="inline" inputVariant="outlined"/>
                
            </Grid>
            <Grid item lg={6}>
                <DatePicker animateYearScrolling value={endDate} onChange={setEndDate} label="End Date" minDate={new Date("2019-12-2")} variant="inline" inputVariant="outlined"/>
            </Grid>
            <Grid item lg={12} md={12} sm={12}>
                <Typography variant="h6" component="h6">
                   Confirmed Cases
                </Typography>
            </Grid>
            <Grid item lg={12} style={{ minWidth: '95%' }}>
                <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={data}margin={{top: 16,right: 16,bottom: 0}}>
                        <Line dot={false} type="monotone" dataKey="Confrimed" stroke="Blue" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis  tickFormatter={tick => {
                                return convert(tick);
                                }}/>
                        <Tooltip  content={<CustomToolTip />}/>
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item lg={12} md={12} sm={12}>
                <Typography variant="h6" component="h6">
                   Confirmed Cases Per Day
                </Typography>
            </Grid>
            <Grid item lg={12} style={{ minWidth: '95%' }}>
                <ResponsiveContainer height={window.innerHeight*0.3} margin={{top: 16,right: 16,bottom: 0}}>
                    <LineChart width={window.innerWidth*0.4} data={data}>
                        <Line dot={false} type="monotone" dataKey="Confrimed Per Day" stroke="Blue" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis  tickFormatter={tick => {
                                return convert(tick);
                                }}/>
                        <Tooltip  content={<CustomToolTip />}/>
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
            </Grid>
            <Grid item lg={12} md={12} sm={12}>
                <Typography variant="h6" component="h6">
                   Deaths
                </Typography>
            </Grid>
            <Grid item lg={12} style={{ minWidth: '95%' }}>
                <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={data} margin={{top: 16,right: 16,bottom: 0}}>
                        <Line dot={false} type="monotone" dataKey="Deaths" stroke="darkred" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={tick => {
                                return convert(tick);
                                }}/>
                        <Tooltip content={<CustomToolTip/>} />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item lg={12} md={12} sm={12}>
                <Typography variant="h6" component="h6">
                   Deaths Per Day
                </Typography>
            </Grid>
            <Grid item lg={12} style={{ minWidth: '95%' }}>
                <ResponsiveContainer height={window.innerHeight*0.3} margin={{top: 16,right: 16,bottom: 0}}>
                    <LineChart width={window.innerWidth*0.4} data={data}>
                        <Line dot={false} type="monotone" dataKey="Deaths Per Day" stroke="darkred" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={tick => {
                                return convert(tick);
                                }}/>
                        <Tooltip content={<CustomToolTip/>} />
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
            </Grid>
            <Grid item lg={12} md={12} sm={12}>
                <Typography variant="h6" component="h6">
                Recovered
                </Typography>
            </Grid>
            <Grid item lg={12} style={{ minWidth: '95%' }}>
                <ResponsiveContainer height={window.innerHeight*0.3} >
                    <LineChart width={window.innerWidth*0.4} data={data} margin={{top: 16,right: 16,bottom: 0}}>
                        <Line dot={false} type="monotone" dataKey="Recovered" stroke="Green" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={tick => {
                                return convert(tick);
                                }}/>
                        <Tooltip content={<CustomToolTip/>} />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item lg={12} md={12} sm={12}>
                <Typography variant="h6" component="h6">
                   Recovered Per Day
                </Typography>
            </Grid>
            <Grid item lg={12} style={{ minWidth: '95%' }}>
                <ResponsiveContainer height={window.innerHeight*0.3} margin={{top: 16,right: 16,bottom: 0}}>
                    <LineChart width={window.innerWidth*0.4} data={data}>
                        <Line dot={false} type="monotone" dataKey="Recovered Per Day" stroke="Green" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={tick => {
                                return convert(tick);
                                }}/>
                        <Tooltip content={<CustomToolTip/>} />
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
            </Grid>
        </Grid>
    </div>
}