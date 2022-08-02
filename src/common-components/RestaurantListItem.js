import { Link } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import RoomIcon from '@mui/icons-material/Room';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TodayIcon from '@mui/icons-material/Today';
import DescriptionIcon from '@mui/icons-material/Description';

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
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <CardContent sx={{ flex: '1 1 0' }}>
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
                    {props.page === 'guestCurrentReservations' ? 
                        (<>
                            <ListItem>
                                <ListItemIcon>
                                    <TodayIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    {new Date(data.bookingtime).toLocaleDateString(
                                        'en-CA',
                                        options
                                    )}
                                </ListItemText>
                            </ListItem>
                            {data.note && data.note.length ? 
                                <ListItem>
                                    <ListItemIcon>
                                        <DescriptionIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Your note: {data.note}
                                    </ListItemText>
                                </ListItem> : null}
                        </>
                        ) : null
                    }
                </List>
            </CardContent>

            {props.page === 'guestMain' && (
                <CardActions sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    gap: 1
                }}>
                    <Button
                        component={Link}
                        to="/guest/restaurant/map"
                        variant='contained'
                        state={data}
                    >
                        Book
                    </Button>
                </CardActions>
            )}

            {props.page === 'guestCurrentReservations' && (
                <CardActions sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    gap: 1
                }}>
                    <Button
                        onClick={() => onDeleteBooking(data.reservationid)}
                        variant="contained"
                        color='error'
                    >
                        Delete Booking
                    </Button>
                </CardActions>
            )}

            {props.page === 'ownerMain' && (
                <CardActions sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    gap: 1
                }}>
                    <Button
                        onClick={() => onRestaurantDelete(data.restaurantid)}
                        color="error"
                        variant='outlined'
                    >
                        Delete
                    </Button>
                    <Button
                        component={Link}
                        to={`/owner/restaurant/edit`}
                        state={{ data }}
                        variant="contained"
                    >
                        Edit
                    </Button>
                </CardActions>
            )}
        </Card>
    )
}
