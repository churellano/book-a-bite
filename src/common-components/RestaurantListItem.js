import { Link } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { deleteRestaurantOwner } from '../api/api'

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

    const onDeleteBooking = () => {
        // TODO: handle delete
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
            </CardContent>

            {props.page === 'guestMain' && (
                <CardActions>
                    <Button
                        component={Link}
                        to="/guest/restaurant/map"
                        size="small"
                    >
                        Book
                    </Button>
                </CardActions>
            )}

            {props.page === 'guestProfile' && (
                <CardActions>
                    <Button onClick={onDeleteBooking} size="small">
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
