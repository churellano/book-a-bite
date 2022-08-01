import { useState, useEffect } from 'react'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'

import Navbar from '../common-components/Navbar'
import RestaurantListItem from '../common-components/RestaurantListItem'
import { getAllRestaurantsGuest } from '../api/api'
import GuestGoogleMaps from './GuestGoogleMaps.js'
import { Container } from '@mui/system'

export default function GuestMain() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        getAllRestaurantsGuest()
            .then((res) => {
                setRestaurants(res.data)
            })
            .catch((err) => console.error(err))
    }, [])

    return (
        <div>
            <Navbar isGuestMode={true} />
            <Container>
                <Typography variant="h4" component="div" mb={3} textAlign="center">
                    Book a Table!
                </Typography>
                {restaurants.length ? 
                    <Grid container spacing={2}>
                        {Array.isArray(restaurants) &&
                            restaurants.map((rest) => (
                                <Grid key={rest.address} item xs={12} sm={6}>
                                    <RestaurantListItem data={rest} page="guestMain" />
                                </Grid>
                            ))}
                    </Grid> : 
                    
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <CircularProgress />
                    </Box> 
                }

                <GuestGoogleMaps />

            </Container>

        </div>
    )
}
