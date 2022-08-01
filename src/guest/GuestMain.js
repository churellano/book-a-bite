import { useState, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'

import Navbar from '../common-components/Navbar'
import RestaurantListItem from '../common-components/RestaurantListItem'
import { getAllRestaurantsGuest } from '../api/api'
import GuestGoogleMaps from './GuestGoogleMaps.js'
import { Container } from '@mui/system'

export default function GuestMain() {
    const [restaurant, setRestraurants] = useState([])

    useEffect(() => {
        getAllRestaurantsGuest()
            .then((res) => {
                setRestraurants(res.data)
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
                <Grid container spacing={2}>
                    {Array.isArray(restaurant) &&
                        restaurant.map((rest) => (
                            <Grid key={rest.address} item xs={12} sm={6}>
                                <RestaurantListItem data={rest} page="guestMain" />
                            </Grid>
                        ))}
                </Grid>

                <GuestGoogleMaps />

            </Container>

        </div>
    )
}
