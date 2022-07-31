import { Link } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { deleteReservationGuest, deleteRestaurantOwner } from '../api/api'

export default function RestaurantListItem(props) {
    let data = props.data

    const onRestaurantDelete = async (restaurantid) => {
        try {
            await deleteRestaurantOwner(restaurantid)
            window.location.reload()
        } catch (e) {
            console.error(e)
        }
    }

    const onDeleteBooking = async (reservationid) => {
        try {
            await deleteReservationGuest(reservationid)
            window.location.reload()
        } catch (e) {
            console.error(e)
        }
    }

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {data.name}
                </Typography>
                <Typography color="text.secondary">
                    Address: {data.address}
                </Typography>
                <Typography color="text.secondary">
                    Phone: {data.phone}
                </Typography>
                <Typography color="text.secondary">
                    Rating: {data.rating}
                </Typography>
                {props.page === 'ownerMain' && (
                    <Typography color="text.secondary" sx={{ mt: 4 }}>
                        Booking Status:{' '}
                    </Typography>
                )}
                {props.page === 'guestCurrentReservations' && (
                    <Typography color="text.secondary" sx={{ mt: 4 }}>
                        Booking Time:
                        {new Date(data.bookingtime).toLocaleDateString(
                            'en-CA',
                            options
                        )}
                    </Typography>
                )}
            </CardContent>

            {props.page === 'guestMain' && (
                <CardActions>
                    <Button
                        component={Link}
                        to="/guest/restaurant/map"
                        size="small"
                        state={data}
                    >
                        Book
                    </Button>
                </CardActions>
            )}

            {props.page === 'guestCurrentReservations' && (
                <CardActions>
                    <Button
                        onClick={() => onDeleteBooking(data.reservationid)}
                        size="small"
                    >
                        Delete Booking
                    </Button>
                </CardActions>
            )}

            {props.page === 'ownerMain' && (
                <CardActions>
                    <Button
                        onClick={() => onRestaurantDelete(data.restaurantid)}
                        size="small"
                    >
                        Delete
                    </Button>
                    <Button
                        component={Link}
                        to={`/owner/restaurant/edit`}
                        state={{ data }}
                        size="small"
                    >
                        Edit
                    </Button>
                </CardActions>
            )}
        </Card>
    )
}
