import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Utility from "../utility";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function GuestConfirmReservationModal({
  open,
  selectedTime,
  handleClose,
  handleConfirm
}) {
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography variant="h4" component="h1">
          Confirm reservation
        </Typography>
        <Typography variant="h5" component="h2">
          {selectedTime.tableName}
        </Typography>
        <Typography variant="h6" component="h3">
          {`${Utility.dayToDayName(selectedTime.bookingTime.getDay())}, ${Utility.monthToMonthName(selectedTime.bookingTime.getMonth())} ${selectedTime.bookingTime.getDay()} at ${Utility.formatTimeTo12HourString(selectedTime.bookingTime)}`}
        </Typography>
        <Box mt={2} sx={{
          display: 'flex',
          flexDirection: 'column',
          '& > div': {
            mt: 2
          }
        }}>
          <TextField
            label="Number of guests"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={numberOfGuests}
            error={numberOfGuests <= 0}
            helperText={numberOfGuests <= 0 && "Number of guests must be greater than 0"}
            onChange={e => setNumberOfGuests(e.target.value)}
          />
          <TextField
            label="Notes"
            multiline
            rows={3}
            placeholder="Note any special requests"
            variant="standard"
          />
          <Box sx={{
            display: 'flex',
            justifyContent: 'end',
            '& > button': {
              ml: 2
            }
          }}>
            <Button variant="contained" onClick={handleConfirm}>Reserve time</Button>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          </Box>
        </Box>
      </Box>
        
    </Modal>
  );
}