import React, { useState, useEffect } from 'react';
import{ MenuItem, FormControl ,Select, Card, CardContent } from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map'
import Table from './Table';

import {sortData , prettyPrintStat } from './util'
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css";

import './App.css';




function App() {
    //https://disease.sh/v3/covid-19/continents
    //STATE==HOW TO WRITE VARIABLE IN REACT JS
    const [Countries, setCountries] = useState([]);
    const [Country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo]=useState('worldwide');
    const [TableData,setTableData] = useState([[]]);
    const [MapCenter, setMapCenter] = useState({lat:34.80746,lng:-40.4796});
    const [MapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState('cases');

    useEffect(() => {
      fetch("https://disease.sh/v3/covid-19/all")
      .then(response=>response.json())
      .then((data)=>{
        setCountryInfo(data);
      });
    }, [])

    useEffect(() => {
     
      const getCountrysData=async()=>{
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response=>response.json())
          .then((data)=>{
            const countries=data.map((country)=>({
              name:country.country,
              value:country.countryInfo.iso2,

            }));
            const sortedData=sortData(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountries(countries);
          });
        };
          getCountrysData();
          
    
    },[]);

    const onCountryChange=async (event)=>{
      const countryCode=event.target.value

     const url=
      countryCode  ===  'worldwide'
    ? 'https://disease.sh//v3/covid-19/all':
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      await fetch(url)
      .then(response=>response.json())
      .then((data)=>{

    
   setCountry(countryCode);
   setCountryInfo(data);
   setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
   setMapZoom(4);
      });
    };
  



  return (
    <div className="App">
    <div className="app__left">
      <div className="app__header">
    {/*header */}
    {/*title and select input into the drop down menu */}
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select varient="Outlined"onChange={onCountryChange} value={Country}>
        {/*loop through all the countries in to the drop down menu */}
          <MenuItem value="worldwide">Worldwide</MenuItem>
         { Countries.map((country=>
          <MenuItem value={country.value}>{country.name}</MenuItem>
            ))
        }
        </Select>
      </FormControl>
      </div>

     <div className="app__status">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title='Coronavirus cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
      </div>
      <Map 
      center={MapCenter}
      zoom={MapZoom}
      casesType={casesType}
      countries={mapCountries}
      />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={TableData} />
          <h3 className='app_graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>
    </div>

  );
}

export default App;
