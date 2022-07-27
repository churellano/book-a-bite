import { Box, List, ListItemButton, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import GuestConfirmReservationModal from './GuestConfirmReservationModal'
import Utility from '../utility'

export default function GuestTableAvailableTimes({ availableTimes }) {
    const [open, setOpen] = useState(false)
    const [selectedTime, setSelectedTime] = useState(null)

    const handleClick = (availableTime) => {
        setSelectedTime(availableTime)
        setOpen(true)
    }

    const handleConfirm = () => {
        // TODO: Reserve time
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
