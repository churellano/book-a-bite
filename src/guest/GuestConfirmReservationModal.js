import { Box, Button, Modal, TextField, Typography } from '@mui/material'

import Utility from '../utility'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
}

export default function GuestConfirmReservationModal({
    open,
    minimumReservationDuration,
    selectedTime,
    durationHours,
    durationMinutes,
    numberOfGuests,
    tableCapacity,
    note,
    handleChange,
    handleClose,
    handleConfirm,
}) {
    const isHoursValid = durationHours >= 0;
    const isMinutesValid = durationMinutes >= 0 && durationMinutes <= 59;
    const isDurationValid = isHoursValid && isMinutesValid && (
        durationHours + Utility.minutesToHours(durationMinutes)
    ) >= minimumReservationDuration;
    const isNumberOfGuestsValid = numberOfGuests > 0 && numberOfGuests <= tableCapacity;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h4" component="h1">
                    Confirm reservation
                </Typography>
                <Typography variant="h5" component="h2">
                    {selectedTime.tableName}
                </Typography>
                <Typography variant="h6" component="h3">
                    {`${Utility.dayToDayName(
                        selectedTime.bookingTime.getDay()
                    )}, ${Utility.monthToMonthName(
                        selectedTime.bookingTime.getMonth()
                    )} ${selectedTime.bookingTime.getDay()} at ${Utility.formatTimeTo12HourString(
                        selectedTime.bookingTime
                    )}`}
                </Typography>
                <Box
                    mt={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        '& > div': {
                            mt: 2,
                        },
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2
                    }}>
                        <TextField
                            label="Hours"
                            name="hours"
                            type="text"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            variant="outlined"
                            value={durationHours}
                            error={!isHoursValid}
                            helperText={
                                !isHoursValid ?
                                    'Hours must be a positive integer' :
                                    null
                            }
                            onChange={handleChange}
                        />
                        <TextField
                            label="Minutes"
                            name="minutes"
                            type="text"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            variant="outlined"
                            value={durationMinutes}
                            error={!isMinutesValid}
                            helperText={
                                !isMinutesValid ?
                                    'Minutes must be in the range [0, 59]' :
                                    null
                            }
                            onChange={handleChange}
                        />
                    </Box>
                    {
                        !isDurationValid ?
                            <Typography color="error">Reservation length is invalid.</Typography> :
                            null
                    }
                    
                    <TextField
                        label={`Number of guests (max ${tableCapacity})`}
                        name="numberOfGuests"
                        type="text"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        variant="outlined"
                        value={numberOfGuests}
                        error={!isNumberOfGuestsValid}
                        helperText={
                            !isNumberOfGuestsValid ?
                                `Number of guests must be in the range [1, ${tableCapacity}]` :
                                null
                        }
                        onChange={handleChange}
                    />
                    <TextField
                        label="Notes"
                        name="note"
                        multiline
                        rows={3}
                        placeholder="Note any special requests"
                        variant="standard"
                        value={note}
                        onChange={handleChange}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            '& > button': {
                                ml: 2,
                            },
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleConfirm}
                            disabled={!isDurationValid || !isNumberOfGuestsValid}
                        >
                            Reserve time
                        </Button>
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}
