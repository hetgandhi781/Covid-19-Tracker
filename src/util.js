import React from "react";
import numeral from "numeral";
import {Circle,Popup} from "react-leaflet";

const casesTypeColors={
    cases:{
        hex:"#cc1034",
        multiplier:800,
    },
    recovered:{
        hex:"#7dd71d",
        multiplier:1200,
    },
    deaths:{
        hex:"#07689f",
        multiplier:2000,
    },
};

export const sortData=(data)=>{
    const sortedData=[...data];
    sortedData.sort((a,b) => {
        if(a.cases >b.cases){
            return -1;
        }else{
            return 1;
        }
    });
    return sortedData;

    // sortedData.sort((a,b) => {a.cases > b.coses ? -1 : 1});
    // return sortedData;
};

export const showDataOnMap = (data, casesType) => 
    data.map(country =>(
        <Circle 
            center={[country.countryInfo.lat,country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillcolor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div className="info_flag" style={{backgroundImage: `URL(${country.countryInfo.flag})`}} />
                    <div className="info_name">{country.country}</div>
                    <div className="info_confirmed">Cases :{numeral(country.cases).format("0.0")}</div>
                    <div className="info_recovered">Recovered :{numeral(country.recovered).format("0.0")}</div>
                    <div className="info_deaths">Deaths :{numeral(country.deaths).format("0.0")}</div>
                </div>
            </Popup>
        </Circle>
        
    )
)

export const prettyPrintStat= (stat) =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";