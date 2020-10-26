import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend, ResponsiveContainer} from 'recharts';
import population from './population.json';
import NumberFormat from 'react-number-format';
import {Row, Col, Container,Modal, Button} from 'react-bootstrap';
import Select from 'react-select'
// import 'bootstrap/dist/css/bootstrap.css';
class OldCharts extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      loading: true,
      data: [],
      data2: [],
      allData: [],
      key: "US",
      keys: [],
      percentages: [
          -1.0,
          -0.9,
          -0.8,
          -0.7,
          -0.6,
          -0.5,
          -0.4,
          -0.3, 
          -0.2, 
          -0.1,
            0.0,
            0.1,
            0.2, 
            0.3, 
            0.4,
            0.5,
            0.6,
            0.7,
            0.8,
            0.9,
            1.0
        ],
      falsePositives: 0.5,
      splitData: false,
      showAbout: false
    }
    
  }
  componentDidMount() {
    this.GetData();
  }
  toggleModal=()=>{
      this.setState({showAbout: !this.state.showAbout});
  }
  GetData = ()=>
  {
    var url = "https://pomber.github.io/covid19/timeseries.json";
    fetch(url).then(res=> res.json()).then((result)=>{  
      var keys = Object.keys(result);
      var tempCountries = []
      keys.forEach(element => {
          tempCountries.push({value: element, label: element});
      })
      this.setState({ allData: result, keys: keys, options: tempCountries, loading: false, key: this.state.key}, ()=>{this.UpdateData();});
    });
    
  }
 
  UpdateData= () => {
    var dataTemp = this.getData(this.state.allData[this.state.key]);
    this.setState({data: dataTemp});
  }
 
  getData=(data)=>{
    var ResultData = []
    for(var i = 0; i < data.length; i++){
      var element = {};
      if(data[i].confirmed > 100){
        if(i > 0){
          element["name"] = data[i].date;
          element["Recovered"] = data[i].recovered;
          element["Confrimed"] = data[i].confirmed;
          element["Deaths"] = data[i].deaths;
          element["Deaths Per Day"] = data[i].deaths - data[i-1].deaths;
          element["Confrimed Per Day"] = data[i].confirmed - data[i-1].confirmed;
          element["Recovered Per Day"] = data[i].recovered - data[i-1].recovered;

          element["Recovered False"] = data[i].recovered - data[i].recovered*this.state.falsePositives;
          element["Confrimed False"] = data[i].confirmed - data[i].confirmed*this.state.falsePositives;
          element["Deaths False"] = data[i].deaths - data[i].deaths*this.state.falsePositives;
          element["Deaths Per Day False"] = (data[i].deaths-data[i].deaths*this.state.falsePositives) - (data[i-1].deaths - data[i-1].deaths*this.state.falsePositives);
          element["Confrimed Per Day False"] = (data[i].confirmed-data[i].confirmed*this.state.falsePositives) - (data[i-1].confirmed - data[i-1].confirmed*this.state.falsePositives);
          element["Recovered Per Day False"] = (data[i].recovered-data[i].recovered*this.state.falsePositives) - (data[i-1].recovered -data[i-1].recovered*this.state.falsePositives);
        }
        else{
          element["Deaths Per Day"] = 0;
          element["Confrimed Per Day"] = 0;
          element["Recovered Per Day"] = 0;
        }
        ResultData.push(element);
      }
    }
    return ResultData;
  }
  render() {
    return (
      <Container style={{height: "95vh"}}>
            <Row>
                <Col>	
                    <h3>Covid-19 in {this.state.key}. Population: <NumberFormat value={population[this.state.key]} displayType={'text'} thousandSeparator={true} renderText={value => <>{value}</>} /></h3>
                    <label>Country:</label>
                    <Select
                        onChange={(selectedOption ) => this.setState({key:selectedOption.value }, () =>this.UpdateData())}
                        options={this.state.options}
                        isLoading={this.state.loading}
                        value={{label: this.state.key}}
                        isSearchable
                    />
                    <br/>
                    <Button onClick={()=>this.setState({splitData: !this.state.splitData})}>{this.state.splitData? "Split Data" : "Combine Data"}</Button>&nbsp;&nbsp;
                    <Button onClick={()=> this.toggleModal()}>About</Button><br/>
                </Col>
            </Row>
            {this.state.splitData? 
            <>
                <Row>
                    <Col>
                        <ResponsiveContainer width="99%"  height={200}>
                            <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                                <Line type="monotone" dataKey="Confrimed" stroke="Blue" />
                                <Line type="monotone" dataKey="Recovered" stroke="Green" />
                                <Line type="monotone" dataKey="Deaths" stroke="darkred" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip/>
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>Rate of Change Per Day</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ResponsiveContainer width="99%"  height={200}>
                        <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                            <Line type="monotone" dataKey="Confrimed Per Day" stroke="Blue" />
                            <Line type="monotone" dataKey="Recovered Per Day" stroke="Green" />
                            <Line type="monotone" dataKey="Deaths Per Day" stroke="red" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip/>
                            <Legend />
                        </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row>
                    <Col>	
                    <h3>Covid-19 in {this.state.key} with {this.state.falsePositives*100}% false positives</h3>
                    <label>Percent of false data</label>&nbsp;&nbsp;
                    <select id="percentages" value={this.state.falsePositives} onChange={(e) => this.setState({falsePositives: e.target.value}, () =>this.UpdateData())}>
                        {this.state.percentages.map(element =>
                        <option key={element} value={element}>{element*100}%</option> )}
                    </select>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ResponsiveContainer width="99%"  height={200}>
                        <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data} >
                            <Line type="monotone" dataKey="Confrimed" stroke="Blue" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="Recovered" stroke="Green" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="Deaths" stroke="darkred" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="Confrimed False" stroke="Blue" />
                            <Line type="monotone" dataKey="Recovered False" stroke="Green" />
                            <Line type="monotone" dataKey="Deaths False" stroke="darkred" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip/>
                            <Legend />
                        </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>Rate of Change Per Day With {this.state.falsePositives*100}% False Positives</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ResponsiveContainer width="99%"  height={200}>
                            <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                                <Line type="monotone" dataKey="Confrimed Per Day False" stroke="Blue" />
                                <Line type="monotone" dataKey="Recovered Per Day False" stroke="Green" />
                                <Line type="monotone" dataKey="Deaths Per Day False" stroke="red" />
                                <Line type="monotone" dataKey="Confrimed Per Day" stroke="Blue" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="Recovered Per Day" stroke="Green" strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="Deaths Per Day" stroke="red" strokeDasharray="5 5" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip/>
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </> 
            :
            <>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                        <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                            <Line type="monotone" dataKey="Confrimed" stroke="Blue" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip/>
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                        <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                            <Line type="monotone" dataKey="Recovered" stroke="Green" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip/>
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
                </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                        <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                            <Line type="monotone" dataKey="Deaths" stroke="darkred" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip/>
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
                </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                    <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                        <Line type="monotone" dataKey="Confrimed Per Day" stroke="Blue" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row> 
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                    <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                        <Line type="monotone" dataKey="Recovered Per Day" stroke="Green" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                    <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                        <Line type="monotone" dataKey="Deaths Per Day" stroke="red" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <Row>
                <Col>	
                <h3>Covid-19 in {this.state.key} with {this.state.falsePositives*100}% false positives</h3>
                <label>Percent of false data</label>&nbsp;&nbsp;
                <select id="percentages" value={this.state.falsePositives} onChange={(e) => this.setState({falsePositives: e.target.value}, () =>this.UpdateData())}>
                    {this.state.percentages.map(element =>
                    <option key={element} value={element}>{element*100}%</option> )}
                </select>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                    <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data} >
                        <Line type="monotone" dataKey="Confrimed" stroke="Blue" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="Confrimed False" stroke="Blue" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                    <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data} >
                        <Line type="monotone" dataKey="Recovered" stroke="Green" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="Recovered False" stroke="Green" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                    <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data} >
                        <Line type="monotone" dataKey="Deaths" stroke="darkred" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="Deaths False" stroke="darkred" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                    </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>Rate of Change Per Day With {this.state.falsePositives*100}% False Positives</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                        <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                            <Line type="monotone" dataKey="Confrimed Per Day False" stroke="Blue" />
                            <Line type="monotone" dataKey="Confrimed Per Day" stroke="Blue" strokeDasharray="5 5" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip/>
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                        <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                            <Line type="monotone" dataKey="Recovered Per Day False" stroke="Green" />
                            <Line type="monotone" dataKey="Recovered Per Day" stroke="Green" strokeDasharray="5 5" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip/>
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ResponsiveContainer width="99%"  height={200}>
                        <LineChart width={window.innerWidth*0.4} height={200} data={this.state.data}>
                            <Line type="monotone" dataKey="Deaths Per Day False" stroke="red" />
                            <Line type="monotone" dataKey="Deaths Per Day" stroke="red" strokeDasharray="5 5" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip/>
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
            </>
        }
         <Modal show={this.state.showAbout} centered onHide={this.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>About</Modal.Title>
        </Modal.Header>
        <Modal.Body><p>This page is to show how each country is dealing with COVID-19. Along with demostrating how many new confrimed, recovered, and deaths per day. 
            An extra feature is to demonstrate how a posible percentage of false data can skew the numbers.
            <br/><br/>
            Data is being pulled from https://github.com/pomber/covid19. Which is converting data from here https://github.com/CSSEGISandData/COVID-19 into a Json file. 
            Along with modifiying some population data from https://datahub.io/core/population and Google for some countries that were not on the list. 
            </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
		</Container>

		);
	}
}

export default OldCharts;