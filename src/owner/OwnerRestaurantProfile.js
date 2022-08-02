import { Box, TextField, Typography } from '@mui/material'
import Autocomplete from "react-google-autocomplete";

//  - add API Key to .env @Rauf 
const API_KEY = "AIzaSyDYwipDM1p4k_JDS4f4d65bTtosobHOGRo";


export default function OwnerRestaurantProfile({
    name,
    address,
    isAddrSelected,
    phone,
    capacity,
    openingTime,
    closingTime,
    minimumReservationDuration,
    reservationInterval,
    setName,
    setAddress,
    setIsAddrSelected,
    setPhone,
    setCapacity,
    setOpeningTime,
    setClosingTime,
    setMinimumReservationDuration,
    setReservationInterval,
}) {
    const isPhoneValid = phone.match(/[0-9]{10}/)

    const placeSelected = async (place) => {
        let selectedAddr = place.formatted_address;
        setAddress(selectedAddr);
        setIsAddrSelected(true);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                '& > *': {
                    mt: 2,
                },
                '& > div': {
                    display: 'flex',
                    flexDirection: 'column',
                },
                '& > div > .MuiTextField-root': {
                    mt: 2,
                },
            }}
        >
            <div>
                <Typography variant="h5" component="h2">
                    General information
                </Typography>
                <TextField
                    label="Restaurant name"
                    type="text"
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Typography variant="subtitle2" component="div" mt={2} sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.75rem',
                }}>
                    Address
                </Typography>
                <Autocomplete
                    apiKey={API_KEY}
                    onPlaceSelected={placeSelected}
                    options={{
                        types: ["address"],
                        componentRestrictions: { country: "ca" },
                    }}
                    style={{ width: "100%", height: "2rem", margin: "0", }}
                    defaultValue={address}
                />
                <TextField
                    label="Restaurant phone number"
                    type="text"
                    variant="standard"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    error={!isPhoneValid}
                    helperText={
                        !isPhoneValid
                            ? 'Please enter a valid phone number without special characters.'
                            : null
                    }
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                    label="Total capacity"
                    type="text"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={capacity}
                    onChange={(e) => setCapacity(+e.target.value)}
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
                        step: 300,
                    }}
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                />
                <TextField
                    label="Closing time"
                    type="time"
                    inputProps={{
                        step: 300,
                    }}
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
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
                        pattern: '[0-9]*',
                    }}
                    value={minimumReservationDuration}
                    onChange={(e) =>
                        setMinimumReservationDuration(+e.target.value)
                    }
                />
                <TextField
                    label="Time between reservations (minutes)"
                    type="text"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={reservationInterval}
                    onChange={(e) => setReservationInterval(+e.target.value)}
                />
            </div>
        </Box>
    )
}
