import { FormControl, MenuItem,Select ,Card, CardContent} from '@material-ui/core';
import React,{useState,useEffect} from 'react';
import './App.css';
import Infobox from "./Infobox.js";
import Map from "./Map.js";
import Table from "./Table.js";
import {prettyPrintStat, sortData} from "./util.js";
import Linegraph from "./Linegraph.js";
import "leaflet/dist/leaflet.css";


function App() {
  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide");
  const[countryInfo,setCountryInfo]=useState({});
  const[tableData,setTableData]=useState([]);
  const[mapCenter,setMapCenter]=useState({lat:34.80746 ,lng:-40.4796});
  const[mapZoom,setMapZoom]=useState(3);
  const[mapCountries,setMapCountries]=useState([]);
  const[casesType,setCasesType]=useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response =>response.json())
    .then(data =>{
      setCountryInfo(data);
    })
  } , [])

  useEffect(()=>{
    const getCountriesData= async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=> {
        const countries =data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));
          const sortedData=sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event)=>{
    const countryCode=event.target.value;
    const url=
     countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" 
    :`https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((response) => response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);
      countryCode === "worldwide" ? setMapCenter([34.80746 ,-40.4796]) : setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      countryCode === "worldwide"? setMapZoom(3) : setMapZoom(4);
    });
  };
  console.log("country",countryInfo);

  return (
    <div className="App">
    <div className="app__left">
    <div className="app__header">
      <h1>Covid-19 Tracker</h1>
      <FormControl className="app__dropdown">
        <Select
        onChange={onCountryChange}
        variant="outlined"
        value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
        {
          countries.map(country =>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))
        }
        </Select>
      </FormControl>
    </div>

    <div className="app__stats">
      <Infobox 
      isRed
      active={casesType==="cases"}
      onClick= {e =>setCasesType('cases')}     
      title="Cases" cases={prettyPrintStat( countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
      <Infobox
      isGreen
      active={casesType==="recovered"}
      onClick= {e =>setCasesType('recovered')}
      title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
      <Infobox
      isBlue
      active={casesType==="deaths"}
      onClick= {e =>setCasesType('deaths')}
      title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
    </div>

    <Map 
    casesType={casesType}
    countries={mapCountries} 
    center={mapCenter} 
    zoom={mapZoom} />
    </div>
    <Card className="app__right">
        <CardContent className="app__rightChild">
          <h3 className="app__tableTitla"><span className="blink"><span className="red_dot">🔴</span>Live</span> Cases by Country</h3>
          <Table countries={tableData} />
        </CardContent>
        <CardContent className="app__rightChild1 ">
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <Linegraph className="app__graph" casesType={casesType}/>
        </CardContent>
    </Card>

    </div>
  );
}

export default App;