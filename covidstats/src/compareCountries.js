    import React from 'react';
    import Tabs from '@material-ui/core/Tabs';
    import Tab from '@material-ui/core/Tab';
    import Box from '@material-ui/core/Box';
    import PropTypes from 'prop-types';
    import Autocomplete from '@material-ui/lab/Autocomplete';
    import TextField from '@material-ui/core/TextField';
    import {DatePicker} from '@material-ui/pickers';
    import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend, ResponsiveContainer} from 'recharts';
import { Grid } from '@material-ui/core';
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
        value: PropTypes.any.isRequired
    };
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    return color;
    }
    function a11yProps(index) {
        return {
          id: `scrollable-auto-tab-${index}`,
          'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
      }

    const CustomToolTip = props => {
    const { active, payload, label } = props;
    if (!active || !payload) {
        return null;
    }
    return (
        <div
        style={{backgroundColor: "white", paddingLeft:"10%"}}
        >
        <p>
            {label}
        </p>
        {payload.map((item, i) => (
            <p key={i} style={{color: item.color}}>
            {item.name}: {item.value.toLocaleString()}
            </p>
        ))}
        </div>
    );
    };
    const included = ["US", "India","Bazil","Russia"]
    export default function CompareCountries(){
        const [value, setValue] = React.useState(0);
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
        const [allData, setAllData] = React.useState({});
        const [confiremedData, setConfiremedData] = React.useState();
        const [confiremedPerDayData, setConfiremedPerDayData] = React.useState();
        const [deathsData, setDeathsData] = React.useState([]);
        const [deathsPerDayData, setDeathsPerDayData] = React.useState([]);
        const [recoveredData, setRecoveredData] = React.useState([]);
        const [recoveredPerDayData, setRecoveredPerDayData] = React.useState([]);
        const [keys, setKeys] = React.useState([]);
        const [include, setInclude] = React.useState(included);
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
            var confirmedArray = [];
            var confirmedPerDayArray = [];
            var deathArray = [];
            var deathsPerDayArray = [];
            var recoveredArray = [];
            var recoveredPerDayArray = [];

            for (const [key, value] of Object.entries(allData)) {
                if(include.includes(key)){
                    for(var t in value){
                        var tempData = value[t];
                        var day = tempData.date;
                         var datet = new Date(day);
                         if(datet >= startDate && datet <= endDate){
                             const date = datet.getMonth()+1+"/"+datet.getDate()+"/"+datet.getFullYear();
                             if(day !==""){
                                var idConfirmed = confirmedArray.findIndex(e => e.date === date);
                                var idDeaths = deathArray.findIndex(e=> e.date === date);
                                var idRecovery = recoveredArray.findIndex(e=> e.date === date);
                                if(idConfirmed === -1){
                                    var elementConfirmed = {};
                                    elementConfirmed["date"] = date;
                                    elementConfirmed[key] = tempData.confirmed;
                                    confirmedArray.push(elementConfirmed);
                                   
                                }
                                else{
                                    confirmedArray[idConfirmed][key] = tempData.confirmed;
                                } 
                                if(idDeaths === -1){
                                    var elementDeath= {};
                                    elementDeath["date"] = date;
                                    elementDeath[key] = tempData.deaths;
                                    deathArray.push(elementDeath);
                                }
                                else{
                                    deathArray[idDeaths][key] = tempData.deaths;
                                }                 
                                if(idRecovery === -1){
                                    var elementRecoverd= {};
                                    elementRecoverd["date"] = date;
                                    elementRecoverd[key] = tempData.recovered;
                                    recoveredArray.push(elementRecoverd);
                                }
                                else{
                                    recoveredArray[idDeaths][key] = tempData.recovered;
                                }                                       
                             }
                         }
                    }
                }
            }
            ///Go through confirmed and find the per day information
            confirmedArray.forEach((e) =>{
                var prevDayTemp = new Date(e.date);
                prevDayTemp.setDate(prevDayTemp.getDate()-1);
                var prevDay = prevDayTemp.getMonth()+1+"/"+prevDayTemp.getDate()+"/"+prevDayTemp.getFullYear();
                var prevDayData = confirmedArray.find(item => item.date === prevDay);
                if(prevDayData !== undefined){
                    var element = {};
                    element.date = e.date;
                    Object.keys(e).forEach((k) =>{
                        if(k !=="date"){
                            element[k] =  e[k] -prevDayData[k] ;
                        }
                    })
                    confirmedPerDayArray.push(element)
                }
            })
             ///Go through deaths and find the per day information
             deathArray.forEach((e) =>{
                var prevDayTemp = new Date(e.date);
                prevDayTemp.setDate(prevDayTemp.getDate()-1);
                var prevDay = prevDayTemp.getMonth()+1+"/"+prevDayTemp.getDate()+"/"+prevDayTemp.getFullYear();
                var prevDayData = deathArray.find(item => item.date === prevDay);
                if(prevDayData !== undefined){
                    var element = {};
                    element.date = e.date;
                    Object.keys(e).forEach((k) =>{
                        if(k !=="date"){
                            element[k] =  e[k] -prevDayData[k] ;
                        }
                    })
                    deathsPerDayArray.push(element)
                }
            })
             ///Go through recovered and find the per day information
             recoveredArray.forEach((e) =>{
                var prevDayTemp = new Date(e.date);
                prevDayTemp.setDate(prevDayTemp.getDate()-1);
                var prevDay = prevDayTemp.getMonth()+1+"/"+prevDayTemp.getDate()+"/"+prevDayTemp.getFullYear();
                var prevDayData = recoveredArray.find(item => item.date === prevDay);
                if(prevDayData !== undefined){
                    var element = {};
                    element.date = e.date;
                    Object.keys(e).forEach((k) =>{
                        if(k !=="date"){
                            element[k] =  e[k] -prevDayData[k] ;
                        }
                    })
                    recoveredPerDayArray.push(element)
                }
            })
            setConfiremedPerDayData(confirmedPerDayArray);
            setDeathsPerDayData(deathsPerDayArray)
            setRecoveredPerDayData(recoveredPerDayArray);
            setConfiremedData(confirmedArray);
            setDeathsData(deathArray);
            setRecoveredData(recoveredArray);

        },[allData,startDate, endDate,include])
        return <div>
            <Grid container justify="center" spacing={3} align="center">
                <Grid item lg={12} style={{ minWidth: '95%' }}>
                    <Autocomplete
                        multiple
                        options={keys}
                        value={include}
                        onChange={(e, val) => setInclude(val)}
                        renderInput={(params) => <TextField {...params} label="Included Country" variant="outlined" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <DatePicker animateYearScrolling value={startDate} onChange={setStartDate} label="Start Date" minDate={new Date("2019-12-2")} variant="inline" inputVariant="outlined"/>
                </Grid>
                <Grid item lg={6}>
                    <DatePicker animateYearScrolling value={endDate} onChange={setEndDate} label="End Date" minDate={new Date("2019-12-2")} variant="inline" inputVariant="outlined"/>
                </Grid>
            </Grid>
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
            >
            <Tab label="Cases" {...a11yProps(0)}/>
            <Tab label="Deaths" {...a11yProps(1)} />
            <Tab label="Recovery"{...a11yProps(2)} />
            </Tabs>
            {/* Cases */}
            <TabPanel value={value} index={0}>
                <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={confiremedData}margin={{top: 16,right: 16,bottom: 0,left: 24,}}>
                        {include.map((k) =>
                            <Line type="monotone" dataKey={k} stroke={getRandomColor()} />
                        )}
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis  tickFormatter={tick => {
                                return tick.toLocaleString();
                                }}/>
                        <Tooltip  content={<CustomToolTip />}/>
                        <Legend/>
                    </LineChart>
                </ResponsiveContainer>
                <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={confiremedPerDayData}margin={{top: 16,right: 16,bottom: 0,left: 24,}}>
                        {include.map((k) =>
                            <Line type="monotone" dataKey={k} stroke={getRandomColor()} />
                        )}
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis  tickFormatter={tick => {
                                return tick.toLocaleString();
                                }}/>
                        <Tooltip  />
                        <Legend/>
                    </LineChart>
                </ResponsiveContainer>
            </TabPanel>
            {/* Deaths */}
            <TabPanel value={value} index={1}>
                <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={deathsData}margin={{top: 16,right: 16,bottom: 0,left: 24,}}>
                        {include.map((k) =>
                            <Line type="monotone" dataKey={k} stroke={getRandomColor()} />
                        )}
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis  tickFormatter={tick => {
                                return tick.toLocaleString();
                                }}/>
                        <Tooltip  content={<CustomToolTip />}/>
                        <Legend/>
                    </LineChart>
                </ResponsiveContainer>
                <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={deathsPerDayData}margin={{top: 16,right: 16,bottom: 0,left: 24,}}>
                        {include.map((k) =>
                            <Line type="monotone" dataKey={k} stroke={getRandomColor()} />
                        )}
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis  tickFormatter={tick => {
                                return tick.toLocaleString();
                                }}/>
                        <Tooltip  content={<CustomToolTip />}/>
                        <Legend/>
                    </LineChart>
                </ResponsiveContainer>
            </TabPanel>
            {/* Recovery */}
            <TabPanel value={value} index={2}>
            <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={recoveredData}margin={{top: 16,right: 16,bottom: 0,left: 24,}}>
                        {include.map((k) =>
                            <Line type="monotone" dataKey={k} stroke={getRandomColor()} />
                        )}
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis  tickFormatter={tick => {
                                return tick.toLocaleString();
                                }}/>
                        <Tooltip  content={<CustomToolTip />}/>
                        <Legend/>
                    </LineChart>
                </ResponsiveContainer>
                <ResponsiveContainer height={window.innerHeight*0.3}>
                    <LineChart width={window.innerWidth*0.4} data={recoveredPerDayData}margin={{top: 16,right: 16,bottom: 0,left: 24,}}>
                        {include.map((k) =>
                            <Line type="monotone" dataKey={k} stroke={getRandomColor()} />
                        )}
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis  tickFormatter={tick => {
                                return tick.toLocaleString();
                                }}/>
                        <Tooltip  content={<CustomToolTip />}/>
                        <Legend/>
                    </LineChart>
                </ResponsiveContainer>
            </TabPanel>
        </div>
    }