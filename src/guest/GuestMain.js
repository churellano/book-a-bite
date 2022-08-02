import { useState, useEffect } from 'react'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'

import Navbar from '../common-components/Navbar'
import RestaurantListItem from '../common-components/RestaurantListItem'
import { getAllRestaurantsGuest } from '../api/api'
import GuestGoogleMaps from './GuestGoogleMaps.js'
import { Container } from '@mui/system'

export default function GuestMain() {
    const [isLoading, setIsLoading] = useState(true)

    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        getAllRestaurantsGuest()
            .then((res) => {
                setRestaurants(res.data)
                setIsLoading(false)
            })
            .catch((err) => console.error(err))
    }, [])

    return (
        <div>
            <Navbar isGuestMode={true} />
            <Container sx={{
                my: 4
            }}>
                <Typography
                    variant="h4"
                    component="div"
                    mb={3}
                    textAlign="center"
                >
                    Book a Table!
                </Typography>

                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : Array.isArray(restaurants) && restaurants.length ? (
                    <div>
                        <GuestGoogleMaps allRestaurants={restaurants} />
                        <Grid container spacing={2}>
                            {Array.isArray(restaurants) &&
                                restaurants.map((rest) => (
                                    <Grid
                                        key={rest.address}
                                        item
                                        xs={12}
                                        sm={6}
                                    >
                                        <RestaurantListItem
                                            data={rest}
                                            page="guestMain"
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                ) : (
                    <Box
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        <Typography>No restaurants found.</Typography>
                    </Box>
                )}
            </Container>
        </div>
    )
}
