import { Box, InputAdornment, TextField, Typography } from "@mui/material";

export default function OwnerRestaurantProfile({
  name,
  address,
  phone,
  capacity,
  openingTime,
  closingTime,
  mininumReservationDuration,
  reservationInterval,
  setName,
  setAddress,
  setPhone,
  setCapacity,
  setOpeningTime,
  setClosingTime,
  setMininumReservationDuration,
  setReservationInterval
}) {
  const isPhoneValid = phone.match(/[0-9]{10}/);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        mt: 2
      },
      '& > div': {
        display: 'flex',
        flexDirection: 'column',
      },
      '& > div > .MuiTextField-root': {
        mt: 2
      }
    }}>
      <div>
        <Typography variant="h5" component="h2">
          General information
        </Typography>
        <TextField
          label="Restaurant name"
          type="text"
          variant="standard"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label="Restaurant address"
          type="text"
          variant="standard"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <TextField
          label="Restaurant phone number"
          type="text"
          variant="standard"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          error={!isPhoneValid}
          helperText={!isPhoneValid ? 'Please enter a valid phone number without special characters.': null}
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <TextField
          label="Total capacity"
          type="text"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
        />
      </div>
      
      <div>
        <Typography variant="h5" component="h2">
          Operating hours
        </Typography>
        <TextField
          label="Opening time"
          type="time"
          inputProps={{
            step: 300
          }}
          value={openingTime}
          onChange={e => setOpeningTime(e.target.value)}
        />
        <TextField
          label="Closing time"
          type="time"
          inputProps={{
            step: 300
          }}
          value={closingTime}
          onChange={e => setClosingTime(e.target.value)}
        />
      </div>
      
      <div>
        <Typography variant="h5" component="h2">
          Reservation preferences
        </Typography>
        <TextField
          label="Minimum reservation duration (minutes)"
          type="text"
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          value={mininumReservationDuration}
          onChange={e => setMininumReservationDuration(e.target.value)}
        />
        <TextField
          label="Time between reservations (minutes)"
          type="text"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={reservationInterval}
          onChange={e => setReservationInterval(e.target.value)}
        />
      </div>
    </Box>
  );
}