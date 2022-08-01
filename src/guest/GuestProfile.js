import { useState, useEffect } from 'react'
import { Box, Typography, Button, TextField, Container, Paper, CircularProgress, Snackbar } from '@mui/material'

import Navbar from '../common-components/Navbar'
import { getProfileGuest, saveProfileGuest } from '../api/api'
import Utility from '../utility'

export default function GuestProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        getProfileGuest(sessionStorage.getItem('userId'))
            .then((res) => {
                setFirstName(res.data.fname);
                setLastName(res.data.lname);
                setPhone(res.data.phone);
                setEmail(res.data.email);
                setIsLoading(false);
            })
            .catch((err) => console.error(err))
    }, [])

    const handleChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        switch (inputName) {
            case 'fname':
                setFirstName(inputValue);
                break;
            case 'lname':
                setLastName(inputValue);
                break;
            case 'phone':
                setPhone(inputValue);
                break;
            case 'email':
                setEmail(inputValue);
                break;
            default:
                return;
        }
    }

    const isFirstNameValid = !!firstName && firstName.length;
    const isLastNameValid = !!lastName && lastName.length;
    const isPhoneValid = !!phone && Utility.isPhoneValid(phone);
    const isEmailValid = !!email && Utility.isEmailValid(email);


    const editingView = isLoading ? (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <CircularProgress />
        </Box> 
    ) : (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            


            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                '& > .MuiTextField-root': {
                    flex: '1 1 0'
                }
            }}>
                <TextField
                    label="First name"
                    name="fname"
                    type="text"
                    variant="standard"
                    value={firstName}
                    error={!isFirstNameValid}
                    helperText={
                        !isFirstNameValid ?
                            'First name is invalid' :
                            null
                    }
                    disabled={!isEditing}
                    onChange={handleChange}
                />
                <TextField
                    label="Last name"
                    name="lname"
                    type="text"
                    variant="standard"
                    value={lastName}
                    error={!isLastNameValid}
                    helperText={
                        !isLastNameValid ?
                            'Last name is invalid' :
                            null
                    }
                    disabled={!isEditing}
                    onChange={handleChange}
                />
            </Box>
            <TextField
                label="Phone number"
                name="phone"
                type="tel"
                variant="standard"
                value={phone}
                error={!isPhoneValid}
                helperText={
                    !isPhoneValid ?
                        'Phone number is invalid' :
                        null
                }
                disabled={!isEditing}
                onChange={handleChange}
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                variant="standard"
                value={email}
                error={!isEmailValid}
                helperText={
                    !isEmailValid ?
                        'Email is invalid' :
                        null
                }
                disabled={!isEditing}
                onChange={handleChange}
            />
        </Box>
    )

    const saveProfile = async () => {
        const profile = {
            guestid: sessionStorage.getItem('userId'),
            fname: firstName,
            lname: lastName,
            phone,
            email
        }

        setIsEditing(false);
        await saveProfileGuest(profile)
        setSnackbarOpen(true);
    }

    const startEditing = () => {
        setIsEditing(true);
    }

    return (
        <>
            <Navbar isGuestMode={true} />
            <Container>
                <Paper component={Box} p={2} variant="outlined" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Typography variant="h5" component="div">
                        User Info
                    </Typography>

                    {editingView}
                    <Box sx={{ flex: '1 1 0' }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={isEditing ? saveProfile : startEditing}
                        >
                            {isEditing ? 'Save Profile' : 'Edit Profile'}
                        </Button>
                    </Box >
                    
                </Paper>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={5000}
                    onClose={() => setSnackbarOpen(false)}
                    message="Profile updated"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                />
            </Container>
        </>
    )
}
