import { useState, useEffect } from 'react'
import { Button, Grid } from '@mui/material'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import Navbar from '../common-components/Navbar'
import RestaurantListItem from '../common-components/RestaurantListItem'
import { getAllRestaurantsOwner } from '../api/api'

export default function OwnerMain() {
    const [restraurants, setRestraurants] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getAllRestaurantsOwner()
            .then((res) => {
                setRestraurants(res.data)
            })
            .catch((err) => console.error(err))
    }, [])

    const addRestaurant = () => {
        navigate('/owner/restaurant/details')
    }

    return (
        <div>
            <Navbar isGuestMode={false} />
            <Grid container spacing={2}>
                {restraurants.map((rest) => (
                    <Grid item xs={12} sm={6}>
                        <RestaurantListItem data={rest} page="ownerMain" />
                    </Grid>
                ))}
            </Grid>
            <Box textAlign="center">
                <Button
                    sx={{ mt: 5 }}
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={addRestaurant}
                >
                    Add Restaurant
                </Button>
            </Box>
            {/* TODO: Add Google Maps */}
        </div>
    )
}
