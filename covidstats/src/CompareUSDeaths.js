import React from 'react';
import deaths from './Deaths2018.json';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,ResponsiveContainer, Cell
  } from 'recharts';
import Typography from '@material-ui/core/Typography';
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
return color;
}
var temp = [];
deaths.forEach(element => {
    element.Deaths = parseInt(element.Deaths,10)
    temp.push(element);
}); 
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
export default function CompareUSDeaths(){
    const [data, setData] = React.useState([]);
    React.useEffect(() =>{
        var url = "https://pomber.github.io/covid19/timeseries.json";
        fetch(url).then(res=> res.json()).then((result)=>{  
        setData([]);
        
        var covidItem = temp.find(e => e.name === "name");
        if(covidItem === undefined){
            temp.push({"name": "Covid-19 (2020)","Deaths": result["US"][result["US"].length-1].deaths});
        }
        temp = temp.sort((a,b) => {
            if(parseInt(a.Deaths,10) > parseInt(b.Deaths,10)){
               return -1;
            }
            else if (b.Deaths > a.Deaths){
               return 1;
            }
            else{
                return 0;
            }
        })
        setData(temp);
        })
    },[]);
    return <div>
         <Typography variant="h6" component="h6">
            Covid Compared to the top 15 deaths in the US. Based on 2018 CDC data
        </Typography>
        <ResponsiveContainer height={window.innerHeight*0.7}>
        <BarChart
        width={1000}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis domain={[0, 700000]}tickFormatter={tick => {
            return tick.toLocaleString();
        }}/>
        <Tooltip  content={<CustomToolTip />}/>
        {/* <Legend /> */}
        <Bar dataKey="Deaths">
        {
          	data?.map((entry, index) => {
            	const color = getRandomColor();
            	return <Cell fill={color}></Cell>;
            })
          }    
        </Bar>
        
      </BarChart>
      </ResponsiveContainer>
    </div>
}