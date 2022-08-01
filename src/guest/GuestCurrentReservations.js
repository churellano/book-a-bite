import { useState, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'

import Navbar from '../common-components/Navbar'
import RestaurantListItem from '../common-components/RestaurantListItem'
import { getCurrentReservationsGuest } from '../api/api'

export default function GuestCurrentReservations(props) {
    const [restaurant, setRestraurants] = useState([])

    useEffect(() => {
        getCurrentReservationsGuest(sessionStorage.getItem('userId'))
            .then((res) => {
                setRestraurants(res.data)
            })
            .catch((err) => console.error(err))
    }, [])

    return (
        <div>
            <Navbar isGuestMode={true} />
            <Typography variant="h4" component="div" mb={3} textAlign="center">
                Your Current Reservations
            </Typography>
            <Grid container spacing={2}>
                {restaurant.map((rest) => (
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
        </div>
    )
}
