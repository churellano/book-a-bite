import { useState, useEffect } from 'react'
import { Box, Typography, Button, TextField } from '@mui/material'

import Navbar from '../common-components/Navbar'
import { getProfileGuest } from '../api/api'

export default function GuestProfile(props) {
    const [email, setEmail] = useState('')
    const [guest, setGuest] = useState([])

    useEffect(() => {
        getProfileGuest()
            .then((res) => {
                setGuest(res.data)
            })
            .catch((err) => console.error(err))
    }, [])

    const onEmailSubmit = (e) => {
        e.preventDefault()
        console.log(email)
    }

    return (
        <div>
            <Navbar isGuestMode={true} />
            <Box ml={2}>
                <Typography variant="h5" component="div">
                    User Info
                </Typography>
                <Typography color="text.secondary">
                    Name: {guest.name}
                </Typography>
                <Typography color="text.secondary">
                    Phone: {guest.phone}
                </Typography>
                <Typography mb={2} color="text.secondary">
                    Email: {guest.email}
                </Typography>
                <Button variant="contained" size="small">
                    Edit Profile
                </Button>
            </Box>

            <Box ml={2} mt={5}>
                <Typography variant="h5" component="div">
                    Set Email Notifications
                </Typography>
                <form>
                    <TextField
                        id="filled-basic"
                        label="Enter Email"
                        variant="filled"
                        onChange={(event) => {
                            setEmail(event.target.value)
                        }}
                    />
                    <br></br>
                    <br></br>
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        onClick={onEmailSubmit}
                    >
                        Submit
                    </Button>
                </form>
            </Box>
        </div>
    )
}
