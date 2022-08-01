import { Link } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import RoomIcon from '@mui/icons-material/Room';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { deleteReservationGuest, deleteRestaurantOwner } from '../api/api'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import Utility from '../utility'

function createOperatingHoursText(openingTime, closingTime) {
    const isOpen = Utility.isRestaurantOpen(openingTime, closingTime);

    const openingHour = Math.floor(openingTime);
    const openingMinute = Utility.hoursToMinutes(openingTime - openingHour);

    const closingHour = Math.floor(closingTime);
    const closingMinute = Utility.hoursToMinutes(closingTime - closingHour);

    const openingDate = new Date();
    openingDate.setHours(openingHour);
    openingDate.setMinutes(openingMinute);

    const closingDate = new Date();
    closingDate.setHours(closingHour);
    closingDate.setMinutes(closingMinute);

    const openTimeText = `Closes ${Utility.formatTimeTo12HourString(closingDate)}`
    const closedTimeText = `Opens ${Utility.formatTimeTo12HourString(openingDate)}`

    return isOpen ? openTimeText : closedTimeText;
}

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
    
    const isOpen24Hours = +data.openingtime === +data.closingtime;
    const isOpen = Utility.isRestaurantOpen(+data.openingtime, +data.closingtime);

    const openStatusListItemText = isOpen24Hours ? (
        <ListItemText
            primary={'Open 24 hours'}
            sx={{
                color: '#388e3c'
            }}
        />
    ) : (
        <ListItemText
            sx={{
                color: isOpen ? '#388e3c' : '#d32f2f'
            }}
            primary={isOpen ? 'Open' : 'Closed'}
            secondary={createOperatingHoursText(+data.openingtime, +data.closingtime)}
        />
    );

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {data.name}
                </Typography>

                <List component='div'>
                    <ListItem>
                        <ListItemIcon>
                            <RoomIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={data.address}
                        />
                    </ListItem>
                    {
                        data.phone ? (
                            <ListItem>
                                <ListItemIcon>
                                    <PhoneIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={data.phone}
                                />
                            </ListItem>
                        ) : null
                    }
                    <ListItem>
                        <ListItemIcon>
                            <AccessTimeIcon />
                        </ListItemIcon>
                        {openStatusListItemText}
                    </ListItem>
                </List>

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
