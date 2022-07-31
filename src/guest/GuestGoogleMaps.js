import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import Autocomplete from "react-google-autocomplete";
import {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

// TODO: 
//  - add API Key to .env @Rauf 
//  - Move Input Address box to OwnerRestaurantProfile.js add restaurant form
//  - Replace hardcoded values with DB stored coordinates..................
//  - Pull Restaurants from DB and show markers with Restaurant Names  
const API_KEY = "AIzaSyDYwipDM1p4k_JDS4f4d65bTtosobHOGRo";

const center = {
  lat: 49.260,
  lng: -123.021
};

// temporary
const coords = [
  {
    lat: 49.230,
    lng: -122.892
  },
  {
    lat: 49.289,
    lng: -123.111
  },
  {
    lat: 49.193,
    lng: -123.079
  }
];

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


export default function GuestGoogleMaps() {
  // using state prevents warnings
  const [libs] = useState(['places']);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: libs,
  });

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>
  } else {
    return <Map />
  }
}

function Map() {
  const [isHovered, setIsHovered] = useState(false);
  const [address, setAddress] = useState("");

  const handleMouseOver = () => {
    setIsHovered(true);
  }

  const placeSelected = async (place) => {
    // console.log(place);
    let selectedAddr = place.formatted_address;
    setAddress(selectedAddr);
    // get Marker coordinates using address
    const results = await getGeocode({ address: selectedAddr });
    const { lat, lng } = await getLatLng(results[0]);
    console.log("lat: " + lat + "Lng: " + lng);
  }

  return (
    <div>
      <Autocomplete
        apiKey={API_KEY}
        onPlaceSelected={placeSelected}
        options={{
          types: ["restaurant"],
          componentRestrictions: { country: "ca" },
        }}
        style={{ width: "400px", height: "2rem", margin: "1rem 0 0 17%", }}
      />
      <GoogleMap zoom={10} center={center} mapContainerStyle={mapContainerStyle}>
        {coords.map((coord, index) => (
          <MarkerF key={index} position={coord} onMouseOver={handleMouseOver}>
            {isHovered && <InfoWindowF>
              <div style={markerDescStyle}>
                <p>Restaurant Name</p>
              </div>
            </InfoWindowF>
            }
          </MarkerF>
        ))}
      </GoogleMap>
    </div >
  );
};

