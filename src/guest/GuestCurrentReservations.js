import { useState, useEffect } from 'react'
import { Box, CircularProgress, Container, Grid, Link, Typography } from '@mui/material'

import Navbar from '../common-components/Navbar'
import RestaurantListItem from '../common-components/RestaurantListItem'
import { getCurrentReservationsGuest } from '../api/api'

export default function GuestCurrentReservations(props) {
    const [isLoading, setIsLoading] = useState(true);

    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        getCurrentReservationsGuest(sessionStorage.getItem('userId'))
            .then((res) => {
                setRestaurants(res.data);
                setIsLoading(false);
            })
            .catch((err) => console.error(err))
    }, [])

    return (
        <div>
            <Navbar isGuestMode={true} />
            <Typography variant="h4" component="div" mb={3} textAlign="center">
                Your Current Reservations
            </Typography>
            <Container>
                {isLoading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <CircularProgress />
                    </Box> 
                ) : restaurants.length ? (
                        <Grid container spacing={2}>
                            {restaurants.map((rest) => (
                                <Grid
                                    key={rest.address + rest.reservationid}
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <RestaurantListItem
                                        data={rest}
                                        page="guestCurrentReservations"
                                    />
                                </Grid>
                            ))}
                        </Grid> 
                    ) : (
                        <Box sx={{
                            textAlign: 'center'
                        }}>
                            <Typography>You have no upcoming reservations.</Typography>
                            <Link href='/guest/main'>Why don't we change that?</Link>
                        </Box>
                    )
                }
            </Container>
        </div>
    )
}
