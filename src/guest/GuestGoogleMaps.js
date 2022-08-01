import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

// TODO: 
//  - add API Key to .env @Rauf 
const API_KEY = "AIzaSyDYwipDM1p4k_JDS4f4d65bTtosobHOGRo";

const center = {
  lat: 49.260,
  lng: -123.021
};

const mapContainerStyle = {
  width: '66%',
  height: '400px',
  left: '15%',
  margin: '1rem'
}

const markerDescStyle = {
  background: `white`,
  padding: 10,
  outline: 0
}


export default function GuestGoogleMaps({ allRestaurants }) {
  // using state prevents warnings in LoadScript
  const [libs] = useState(['places']);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: libs,
  });

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>
  } else {
    return <Map allRestaurants={allRestaurants} />
  }
}

function Map({ allRestaurants }) {
  const [isHovered, setIsHovered] = useState(false);
  const [coordsArrayState, setCoordsArrayState] = useState([]);

  useEffect(() => {
    updateCoordsArray(allRestaurants);
    setTimeout(() => {
      setCoordsArrayState(coords);
    }, 3000);
  }, [])

  const handleMouseOver = () => {
    setIsHovered(true);
  }

  return (
    <GoogleMap zoom={10} center={center} mapContainerStyle={mapContainerStyle}>
      {coordsArrayState.map((coord, index) => (
        <MarkerF key={index} position={coord} onMouseOver={handleMouseOver}>
          {isHovered && <InfoWindowF>
            <div style={markerDescStyle}>
              <p>{allRestaurants[index].name}</p>
            </div>
          </InfoWindowF>
          }
        </MarkerF>
      ))}
    </GoogleMap>
  );
};

// convert restaurant addresses --> Coordinates for Map Markers 
const updateCoordsArray = async (allRestaurants) => {
  allRestaurants.forEach(async (rest) => {
    const results = await getGeocode({ address: rest.address });
    const { lat, lng } = await getLatLng(results[0]);
    if (coords.length < 1 || coords[coords.length - 1].lat !== lat) {
      coords.push({ lat, lng });
    }
  });

}

let coords = [];