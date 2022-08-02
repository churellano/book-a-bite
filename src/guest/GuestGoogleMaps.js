import React, { useEffect, useState } from 'react'
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from '@react-google-maps/api'
import { getGeocode, getLatLng } from 'use-places-autocomplete'

const API_KEY =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY
        : 'AIzaSyDYwipDM1p4k_JDS4f4d65bTtosobHOGRo'

const center = {
    lat: 49.26,
    lng: -123.021,
}

const mapContainerStyle = {
    width: '66%',
    height: '400px',
    left: '15%',
    margin: '1rem',
}

const markerDescStyle = {
    background: `white`,
    padding: 10,
    outline: 0,
}

export default function GuestGoogleMaps({ allRestaurants }) {
    // using state prevents warnings in LoadScript
    const [libs] = useState(['places'])

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: API_KEY,
        libraries: libs,
    })

    if (!isLoaded) {
        return <div>Loading Google Maps...</div>
    } else {
        return <Map allRestaurants={allRestaurants} />
    }
}

function Map({ allRestaurants }) {
    const [coordsArrayState, setCoordsArrayState] = useState([])
    const [showingInfoWindow, setShowingInfoWindow] = useState(false)

    const onMarkerClick = () => {
        setShowingInfoWindow(true)
    }

    const onInfoWindowClose = () => {
        setShowingInfoWindow(false)
    }

    useEffect(() => {
        const updateCoordsArray = async (allRestaurants) => {
            let coords = []
            for (const rest of allRestaurants) {
                const results = await getGeocode({ address: rest.address })
                const { lat, lng } = await getLatLng(results[0])
                if (
                    coords.length < 1 ||
                    coords[coords.length - 1].lat !== lat
                ) {
                    let isClicked = false
                    coords.push({ lat, lng, isClicked })
                }
            }
            setCoordsArrayState(coords)
        }
        // convert restaurant addresses --> Coordinates for Map Markers
        updateCoordsArray(allRestaurants)
    }, [])

    return (
        <GoogleMap
            zoom={10}
            center={center}
            mapContainerStyle={mapContainerStyle}
        >
            {coordsArrayState.map((coord, index) => (
                <Marker
                    key={index}
                    position={{ lat: coord.lat, lng: coord.lng }}
                    clickable
                    onClick={() => onMarkerClick()}
                >
                    {showingInfoWindow && (
                        <InfoWindow
                            position={{ lat: coord.lat, lng: coord.lng }}
                            onCloseClick={() => onInfoWindowClose()}
                        >
                            <div style={markerDescStyle}>
                                <p>{allRestaurants[index].name}</p>
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            ))}
        </GoogleMap>
    )
}
