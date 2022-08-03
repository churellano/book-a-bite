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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import { deleteReservation, deleteRestaurantOwner } from '../api/api'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import Utility from '../utility'
import { useState } from 'react'

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
    const [open, setOpen] = useState(false);

    const onDelete = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    }

    let data = props.data

    const onRestaurantDeleteConfirmed = async (restaurantid) => {
        try {
            const res = await deleteRestaurantOwner(restaurantid)
            if(res.data.constraint === "reservations_restaurantid_fkey") {
                window.alert("You cannot delete a restaurant with reserved tables")
            }
            window.location.reload()
        } catch (e) {
            console.error(e)
        }
    }

    const onReservationDeleteConfrimed = async (reservationid) => {
        try {
            await deleteReservation(reservationid)
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
        <div>
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
                                    </ListItem> : null
                                }
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

                {(props.page === 'guestCurrentReservations' || props.page === 'ownerRestaurantCurrentReservations')&& (
                    <CardActions sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'end',
                        gap: 1
                    }}>
                        <Button
                            onClick={() => onDelete()}
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
                            onClick={() => onDelete()}
                            color="error"
                            variant='outlined'
                        >
                            Delete
                        </Button>
                        <Button
                            component={Link}
                            to={'/owner/restaurant/reservations'}
                            color="primary"
                            variant='outlined'
                            state={data}
                        >
                            View reservations
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

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to delete the entry?
                </DialogTitle>
                <DialogActions>
                {(props.page === 'ownerMain') ? 
                    <Button onClick={() => onRestaurantDeleteConfirmed(data.restaurantid)}>Delete</Button> : 
                    <Button onClick={() => onReservationDeleteConfrimed(data.reservationid)}>Delete</Button>
                }
                <Button onClick={handleClose} autoFocus>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
