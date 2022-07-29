import { useState } from 'react'
import { Box, List, ListItemButton, Paper, Typography } from '@mui/material'

import GuestConfirmReservationModal from './GuestConfirmReservationModal'
import Utility from '../utility'
import { addReservationGuest } from '../api/api'

export default function GuestTableAvailableTimes({ availableTimes }) {
    const [open, setOpen] = useState(false)
    const [selectedTime, setSelectedTime] = useState(null)

    const handleClick = (availableTime) => {
        setSelectedTime(availableTime)
        setOpen(true)
    }

    const handleConfirm = async () => {
        // TODO: Reserve time
        try {
            // pass reservation data in this form:
            let data = {
                guestId: sessionStorage.getItem('userId'),
                tableId: selectedTime.tableId,
                restaurantId: 1, // get this from parent component GuestRestaurantMap
                bookingTime: selectedTime.bookingTime,
                duration: 2, // get this from parent component GuestRestaurantMap
                note: 'test note', // get this from input
            }
            await addReservationGuest(data)
            setOpen(false)
        } catch (e) {
            console.error(e)
        }
        console.log('Debug: Confirming reservation')
    }

    return (
        <Box>
            <Typography variant="h5">Available times</Typography>
            <Paper
                elevation={2}
                sx={{
                    overflowY: 'auto',
                    maxHeight: '100%',
                }}
            >
                <List>
                    {availableTimes.map((time, index) => (
                        <ListItemButton
                            key={index}
                            divider={true}
                            onClick={() => handleClick(time)}
                        >
                            <Typography variant="h6">
                                {Utility.formatTimeTo12HourString(
                                    time.bookingTime
                                )}
                            </Typography>
                        </ListItemButton>
                    ))}
                </List>
            </Paper>
            {selectedTime ? (
                <GuestConfirmReservationModal
                    open={open}
                    selectedTime={selectedTime}
                    handleClose={() => setOpen(false)}
                    handleConfirm={handleConfirm}
                />
            ) : null}
        </Box>
    )
}
