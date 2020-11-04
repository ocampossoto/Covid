import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import StateGraphs from './StateGraphs';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CoungryGraphs from './CountryGraphs';
import {DatePicker} from '@material-ui/pickers';
import MUIDataTable from "mui-datatables";
import { Bar, CartesianGrid, Cell, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Grid, Typography } from '@material-ui/core';
const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
 const DataTypes= [
    {"name": "Confirmed", "color": "Blue"},
    {"name": "Confirmed Per Day", "color":"LightBlue"},
    {"name": "Recovered", "color": "Green"},
    {"name": "Recovered Per Day", "color": "LightGreen"},
    {"name": "Deaths", "color": "DarkRed"},
    {"name": "Deaths Per Day", "color":"Red"}
];
function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }
const topStates = ["Texas", "California", "Florida", "New York", "Illinois"]
export default function USView(){
    const [value, setValue] = React.useState(3);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [responsive] = React.useState("vertical");
    const [allData, setAllData] = React.useState({});
    const [data, setData] = React.useState([]);
    const [keys, setKeys] = React.useState([]);
    const [key, setKey] = React.useState("Select a State");
    const [stateTableData, setStateTableData] = React.useState([]);
    const [USTableData, setUSTableData] = React.useState([]);
    const [cumulative, setCumulative] = React.useState([]);
    const [exclude, setExclude] = React.useState([]);
    const currenDate = new Date();
    const defaultStart = new Date().setMonth(new Date().getMonth()-6);
    const [startUSGraphDate, setStartUSGraphDate] = React.useState(defaultStart);
    const [endUSGraphDate, setEndUSGraphDate] = React.useState(currenDate);
    const [include, setInclude] = React.useState(topStates);
    const [confirmedToday, setConfirmedToday] = React.useState([]);
    const [deathsToday, setDeathsToday] = React.useState([]);
    const [recoveredToday, setRecoveredToday] = React.useState([]);
    React.useEffect(()=>{
        var url = "https://firebasestorage.googleapis.com/v0/b/frcscout-6d1d3.appspot.com/o/covid%2FCovidData.json?alt=media&token=743d535c-3eb2-49f8-8579-8f93589d076e";
        fetch(url).then(res=> res.json()).then((result)=>{  
            var tKeys = Object.keys(result["US"]);
            setAllData(result['US']);
            setKeys(tKeys);
            
        }).catch((error) => {
            console.log(error)
        });
            

    },[]);
    React.useEffect(() =>{
        var data = allData[key];
        var ResultData = []
        for(var i in data){
            var element = {};
            if(data[i].Confirmed > 0){
                element["name"] = i;
                element["Recovered"] = data[i].Recovered !== "" ? parseInt(data[i].Recovered, 10) : 0 ;
                element["Confirmed"] = data[i].Confirmed !== "" ? parseInt(data[i].Confirmed, 10) : 0 ;
                element["Deaths"] = data[i].Deaths!== "" ? parseInt(data[i].Deaths, 10) : 0 ;
                if(ResultData[ResultData.length-1]!==undefined){
                    element["Deaths Per Day"] = data[i].Deaths!== "" ? parseInt(data[i].Deaths, 10) - parseInt(ResultData[ResultData.length-1].Deaths, 10) : 0;
                    element["Confirmed Per Day"] = data[i].Confirmed!== "" ? parseInt(data[i].Confirmed, 10) - parseInt(ResultData[ResultData.length-1].Confirmed, 10) : 0;
                    element["Recovered Per Day"] = data[i].Recovered!== "" ? parseInt(data[i].Recovered, 10) - parseInt(ResultData[ResultData.length-1].Recovered, 10) : 0;
                }
                else{
                    element["Deaths Per Day"] = 0;
                    element["Confirmed Per Day"] = 0;
                    element["Recovered Per Day"] = 0;
                }
            }
            else{
                element["Deaths Per Day"] = 0;
                element["Confirmed Per Day"] = 0;
                element["Recovered Per Day"] = 0;
            }
            ResultData.push(element);
        }
        setData(ResultData);
    
    },[key,allData])
    React.useEffect(() => {
        var results = [];
        for(var i in keys){
            var element = [];
            for(var day in allData[keys[i]]){
                var date = new Date(day);
                if(datesAreOnSameDay(date, new Date(Date.now()))){
                    var tempElement = allData[keys[i]][day];
                    element = [
                        keys[i],
                        tempElement['Recovered'] !== "" ? parseInt(tempElement['Recovered'], 10) : 0,
                        tempElement['Confirmed'] !== "" ? parseInt(tempElement['Confirmed'], 10) : 0,
                        tempElement['Deaths'] !== "" ? parseInt(tempElement['Deaths'], 10) : 0,
                        tempElement['Testing_Rate'] !=="" ? parseFloat(tempElement['Testing_Rate']).toFixed(3): 0.00,
                        tempElement['Mortality_Rate'] !=="" ? parseFloat(tempElement['Mortality_Rate']).toFixed(3): 0.00
                    ]
                }
            }
            results.push(element); 
        }
        setStateTableData(results);
    },[allData,keys])
    React.useEffect(()=>{
        var results = {};
        var tKeys = keys;
        var all = allData;
        for(var i in tKeys){
            if(!exclude.includes(tKeys[i])){
                for(var day in all[tKeys[i]]){
                    var date = new Date(day);
                    if(date >= startUSGraphDate && date <= endUSGraphDate){
                        date = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear();
                        if(day !==""){
                            if (!(date in results)){
                                results[date] = {
                                    'Confirmed': all[tKeys[i]][day]['Confirmed'] !== "" ? parseInt(all[tKeys[i]][day]['Confirmed']): 0, 
                                    'Deaths': all[tKeys[i]][day]['Confirmed'] !== "" ? parseInt(all[tKeys[i]][day]['Confirmed']): 0, 
                                    'Recovered': all[tKeys[i]][day]['Recovered'] !== "" ? parseInt(all[tKeys[i]][day]['Confirmed']): 0,
                                    "Deaths Per Day" : 0,
                                    "Confirmed Per Day" : 0,
                                    "Recovered Per Day" :  0
                                };
                            }
                            else{
                                results[date]['Confirmed'] += all[tKeys[i]][day]['Confirmed']!== ""? parseInt(all[tKeys[i]][day]['Confirmed']): 0;
                                results[date]['Deaths']+= all[tKeys[i]][day]['Deaths'] !== ""? parseInt(all[tKeys[i]][day]['Deaths']): 0;
                                results[date]['Recovered']+= all[tKeys[i]][day]['Recovered'] !== ""? parseInt(all[tKeys[i]][day]['Recovered']): 0;                    
                            }
                        }
                    }
                }
            }
        }
        var finalResults = []
        for(var key in results){
            date = new Date(key);
            var prevDate = new Date(date.setDate(date.getDate()-1));
            prevDate = prevDate.getMonth()+1+"/"+prevDate.getDate()+"/"+prevDate.getFullYear();
            if(prevDate in results){
                results[key]["Deaths Per Day"] = results[key]['Deaths']- results[prevDate]['Deaths'];
                results[key]["Recovered Per Day"] = results[key]['Recovered']- results[prevDate]['Recovered'];
                results[key]["Confirmed Per Day"] = results[key]['Confirmed']- results[prevDate]['Confirmed'];
            }
            var element = results[key];
            element['name'] = key;
            finalResults.push(element);
        }
        setCumulative(finalResults);

    },[exclude, allData,keys,startUSGraphDate, endUSGraphDate])
    React.useEffect(()=>{
        var results = {};
        for(var i in keys){
            for(var day in allData[keys[i]]){
                var currDay = new Date(day);
                var dayStr = currDay.getFullYear() + "-" + (currDay.getMonth()+1) +"-"+ currDay.getDate();
                var element = allData[keys[i]][day];
                if(!isNaN(currDay.getDate())){
                    if (dayStr in results){
                        results[dayStr]["Recovered"] +=element['Recovered'] !== "" ? parseInt(element['Recovered'], 10) : 0;
                        results[dayStr]["Confirmed"] += element['Confirmed'] !== "" ? parseInt(element['Confirmed'], 10) : 0;
                        results[dayStr]["Deaths"] += element['Deaths'] !== "" ? parseInt(element['Deaths'], 10) : 0;
                        results[dayStr]["Testing_Rate"] = parseFloat(results[dayStr]["Testing_Rate"]).toFixed(3) + element['Testing_Rate'] !=="" ? parseFloat(element['Testing_Rate']).toFixed(3): 0.00
                        results[dayStr]["Mortality_Rate"] = parseFloat(results[dayStr]["Mortality_Rate"]).toFixed(3) + element['Mortality_Rate'] !=="" ? parseFloat(element['Mortality_Rate']).toFixed(3): 0.00;
                    }
                    else{
                        results[dayStr] = {
                            "Recovered"     : element['Recovered'] !== "" ? parseInt(element['Recovered'], 10) : 0,
                            "Confirmed"     : element['Confirmed'] !== "" ? parseInt(element['Confirmed'], 10) : 0,
                            "Deaths"        : element['Deaths'] !== "" ? parseInt(element['Deaths'], 10) : 0,
                            'Testing_Rate'  : element['Testing_Rate'] !=="" ? parseFloat(element['Testing_Rate']).toFixed(3): 0.00,
                            'Mortality_Rate': element['Mortality_Rate'] !=="" ? parseFloat(element['Mortality_Rate']).toFixed(3): 0.00}
                    }
                }
               
            }
        }
        var finalResults =[];
        for(var KEY in results){
            finalResults.push([KEY, results[KEY]["Recovered"],results[KEY]["Confirmed"],results[KEY]["Deaths"],results[KEY]["Testing_Rate"],results[KEY]["Mortality_Rate"]])
        };
        setUSTableData(finalResults);
    },[allData, keys])
    React.useEffect(()=>{
        if(value === 4){
            var confirmed = [];
            var deaths = [];
            var recovered = [];
            for (const [key, value] of Object.entries(allData)) {
                if(include.includes(key)){
                   for(var [key1, value1] of Object.entries(value)){
                       var tempData = new Date(key1);
                       if(isToday(tempData)){
                            confirmed.push({state: key, confirmed: parseInt(value1.Confirmed, 10)});
                            deaths.push({state: key, deaths: parseInt(value1.Deaths, 10)});
                            recovered.push({state: key, recovered: parseInt(value1.Recovered, 10)});
                       }
                   }
                }
            }
            confirmed = confirmed.sort((a,b) =>
            {
                if(isFinite(b.confirmed-a.confirmed)){
                    return b.confirmed-a.confirmed;
                }
                else{
                    return isFinite(a) ? 1 : -1;
                }
             })
            deaths = deaths.sort((a,b) =>
            {
                if(isFinite(b.deaths-a.deaths)){
                    return b.deaths-a.deaths;
                }
                else{
                    return isFinite(a) ? 1 : -1;
                }
             })
            recovered = recovered.sort((a,b) =>
            {
                if(isFinite(b.recovered-a.recovered)){
                    return b.recovered-a.recovered;
                }
                else{
                    return isFinite(a) ? 1 : -1;
                }
             })
            setConfirmedToday(confirmed);
            setDeathsToday(deaths);
            setRecoveredToday(recovered)
        }
    },[value, include,allData])
    const totalColumns =  [ 
        { name: 'Date', label: 'Date'},
        { name: 'Recovered', label: 'Recovered'},
        { name: 'Confirmed', label: 'Confirmed' },
        {name: 'Deaths', label: 'Deaths'},
        { name: 'Testing_Rate', label: 'Testing Rate' },
        { name: 'Mortality_Rate', label: 'Mortality Rate' },];
    const stateColumns =  [ 
        { name: 'State', label:'State'},
        { name: 'Recovered', label: 'Recovered'},
        { name: 'Confirmed', label: 'Confirmed' },
        {name: 'Deaths', label: 'Deaths'},
        { name: 'Testing_Rate', label: 'Testing Rate' },
        { name: 'Mortality_Rate', label: 'Mortality Rate' },];
    const stateOptions = {
        filter: true,
        responsive,
        selectableRows: "none",
        expandableRows: false,
        pagination:false
    };
    const totalOptions = {
        filter: true,
        responsive,
        selectableRows: "none",
        expandableRows: false,
        pagination:false
    };
    return <div>
        <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
        >
        <Tab label="Table By State" {...a11yProps(0)}/>
        <Tab label="Graph State" {...a11yProps(1)} />
        <Tab label="Table Totals"{...a11yProps(2)} />
        <Tab label="Graph Totals"{...a11yProps(3)} />
        <Tab label="Compare States"{...a11yProps(4)} />
        </Tabs>
        <TabPanel value={value} index={0}>
            <MUIDataTable
                title={"US States"}
                data={stateTableData}
                columns={stateColumns}
                options={stateOptions} 
            />
        </TabPanel>
        {/* Graph state */}
        <TabPanel value={value} index={1}>
            <Autocomplete
                    options={keys}
                    value={key}
                    onChange={(e, val) => setKey(val)}
                    renderInput={(params) => <TextField {...params} label="State" variant="outlined" />}
            />
            {key !=="Select a State" ? DataTypes.map(item => 
                <StateGraphs key={item.name} data={data} item={item}/>): <></>
            }

        </TabPanel>
        <TabPanel value={value} index={2}>
            <MUIDataTable
                title={"US Totals By Date"}
                data={USTableData}
                columns={totalColumns}
                options={totalOptions} 
            />
        </TabPanel>
        {/* Graph US */}
        <TabPanel value={value} index={3}>
            <Autocomplete
                multiple
                options={keys}
                value={exclude}
                onChange={(e, val) =>{setExclude(val)}}
                renderInput={(params) => <TextField {...params} label="Excluded States" variant="outlined" />}
                style={{marginBottom:"2%"}}
            />
             <DatePicker animateYearScrolling value={startUSGraphDate} onChange={setStartUSGraphDate} label="Start Date" minDate={new Date("2019-12-2")} variant="inline" inputVariant="outlined"/>
                &nbsp;&nbsp;
                <DatePicker animateYearScrolling value={endUSGraphDate} onChange={setEndUSGraphDate} label="End Date" minDate={new Date("2019-12-2")} variant="inline" inputVariant="outlined"/>
            {DataTypes.map(item => 
                <CoungryGraphs keys={keys} key={item.name} data={cumulative} item={item}/>)
            }

        </TabPanel>
        <TabPanel value={value} index={4}>
            <Grid container justify="center" spacing={3} align="center">
                <Grid item lg={12} md={12} sm={12}>
                        <Autocomplete
                        multiple
                        options={keys}
                        value={include}
                        onChange={(e, val) =>{setInclude(val)}}
                        renderInput={(params) => <TextField {...params} label="Included States" variant="outlined" />}
                        style={{marginBottom:"2%"}}
                    />
                </Grid>
                <Grid item lg={12} md={12} sm={12}>
                        <Typography variant="h5">Confirmed</Typography>
                    </Grid>
                <ResponsiveContainer height={window.innerHeight*0.5}>
                    <ComposedChart layout="vertical" data={confirmedToday} margin={{right: 16,left: 24}} >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis type="number" />
                        <YAxis  dataKey="state" type="category" />
                        <Tooltip />
                        <Bar type="monotone" dataKey="confirmed">
                            {
                                include.map((entry, index) => {
                                    const color = getRandomColor();
                                    return <Cell fill={color} />;
                                })
                            }
                        </Bar>
                    </ComposedChart>
                </ResponsiveContainer>
                <Grid item lg={12} md={12} sm={12}>
                        <Typography variant="h5">Deaths</Typography>
                    </Grid>
                <ResponsiveContainer height={window.innerHeight*0.5}>
                    <ComposedChart layout="vertical" data={deathsToday} margin={{right: 16,left: 24}} >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis type="number" />
                        <YAxis  dataKey="state" type="category" />
                        <Tooltip />
                        <Bar type="monotone" dataKey="deaths">
                            {
                                include.map((entry, index) => {
                                    const color = getRandomColor();
                                    return <Cell fill={color} />;
                                })
                            }
                        </Bar>
                    </ComposedChart>
                </ResponsiveContainer>
                <Grid item lg={12} md={12} sm={12}>
                    <Typography variant="h5">Recovered</Typography>
                </Grid>
                <ResponsiveContainer height={window.innerHeight*0.5}>
                    <ComposedChart layout="vertical" data={recoveredToday} margin={{right: 16,left: 24}} >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis type="number" />
                        <YAxis  dataKey="state" type="category" />
                        <Tooltip />
                        <Bar type="monotone" dataKey="recovered">
                            {
                                include.map((entry, index) => {
                                    const color = getRandomColor();
                                    return <Cell fill={color} />;
                                })
                            }
                        </Bar>
                    </ComposedChart>
                </ResponsiveContainer>
            </Grid>
        </TabPanel>
    </div>
}
