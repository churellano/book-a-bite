import { useState } from 'react'
import {
    Box,
    List,
    ListItemButton,
    Paper,
    Snackbar,
    Typography,
} from '@mui/material'

import GuestConfirmReservationModal from './GuestConfirmReservationModal'
import Utility from '../utility'
import { addReservationGuest, sendEmailConfirmation } from '../api/api'

export default function GuestTableAvailableTimes({
    restaurantId,
    availableTimes,
    minimumReservationDuration,
    tableCapacity,
    clearSelectedTable,
}) {
    const [open, setOpen] = useState(false)
    const [selectedTime, setSelectedTime] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const [durationHours, setDurationHours] = useState(1)
    const [durationMinutes, setDurationMinutes] = useState(0)
    const [numberOfGuests, setNumberOfGuests] = useState(1)
    const [note, setNote] = useState('')

    const handleChange = (event) => {
        const inputName = event.target.name
        const inputValue = event.target.value
        switch (inputName) {
            case 'hours':
                setDurationHours(+inputValue || 0)
                break
            case 'minutes':
                setDurationMinutes(+inputValue || 0)
                break
            case 'numberOfGuests':
                setNumberOfGuests(+inputValue || 0)
                break
            case 'note':
                setNote(inputValue)
                break
            default:
                return
        }
    }

    const handleClick = (availableTime) => {
        setSelectedTime(availableTime)
        setOpen(true)
    }

    const handleConfirm = async () => {
        try {
            // Save reservation data
            const reservation = {
                guestId: sessionStorage.getItem('userId'),
                tableId: selectedTime.tableId,
                restaurantId,
                bookingTime: selectedTime.bookingTime,
                duration:
                    durationHours + Utility.minutesToHours(durationMinutes),
                note: note.trim(),
            }

            await addReservationGuest(reservation)
            await sendEmailConfirmation(
                sessionStorage.getItem('userEmail'),
                'Your reservation has been confirmed!'
            )

            setOpen(false)
            clearSelectedTable()
            setSnackbarOpen(true)
        } catch (e) {
            console.error(e)
        }
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
                    minimumReservationDuration={minimumReservationDuration}
                    selectedTime={selectedTime}
                    durationHours={durationHours}
                    durationMinutes={durationMinutes}
                    numberOfGuests={numberOfGuests}
                    tableCapacity={tableCapacity}
                    note={note}
                    handleChange={handleChange}
                    handleClose={() => setOpen(false)}
                    handleConfirm={handleConfirm}
                />
            ) : null}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
                message="Reservation confirmed"
            />
        </Box>
    )
}
