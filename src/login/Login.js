import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Container,
    Paper,
    Grid,
    Typography,
    Alert,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
import { TextField, Button, Link } from '@mui/material'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

import { auth } from '../firebase-config'
import { loginGuest, loginOwner } from '../api/api'

export default function Login() {
    const [errorMsg, setErrorMsg] = useState('')
    const [showError, setShowError] = useState(false)
    const [isOwnerChecked, setisOwnerChecked] = useState(false)
    const navigate = useNavigate()
    const AUTO_NAVIGATE_DELAY = 2000

    const autoNavigateIfLoggedIn = useCallback(() => {
        if (
            JSON.parse(localStorage.getItem('isLoggedIn')) &&
            !JSON.parse(localStorage.getItem('isOwner'))
        ) {
            navigate('/guest/main')
            setTimeout(() => {
                window.location.reload()
            }, 500)
        } else if (
            JSON.parse(localStorage.getItem('isLoggedIn')) &&
            JSON.parse(localStorage.getItem('isOwner'))
        ) {
            navigate('/owner/main')
            setTimeout(() => {
                window.location.reload()
            }, 500)
        } else {
            console.error('cannot auto-navigate since not logged in')
        }
    }, [navigate])

    // listen for login state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setTimeout(() => {
                if (currentUser !== null) {
                    autoNavigateIfLoggedIn()
                } else {
                    localStorage.setItem('isLoggedIn', 'false')
                }
            }, 500)
        })
        return () => {
            // prevents repeated calls
            unsubscribe()
        }
    }, [autoNavigateIfLoggedIn])

    // choice of logging in as Guest/Owner
    const handleCheckboxChange = () => {
        setisOwnerChecked(!isOwnerChecked)
    }

    const submit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setShowError(false)
        login(data)
    }

    const login = (data) => {
        // try to login as a guest by accessing DB
        if (!isOwnerChecked) {
            loginGuest(data.get('email'))
                .then(async (res) => {
                    if (res.data) {
                        await signInWithEmailAndPassword(
                            auth,
                            data.get('email'),
                            data.get('password')
                        )
                        localStorage.setItem('isLoggedIn', 'true')
                        localStorage.setItem('isOwner', 'false')
                        // TODO: instead of storing userId in sessionStorage, store userId at the backend using express-session
                        sessionStorage.setItem('userId', res.data.guestid)
                        setTimeout(() => {
                            navigate('/guest/main')
                        }, AUTO_NAVIGATE_DELAY)
                    } else {
                        displayClientError('ERROR: Guest not found in DB')
                    }
                })
                .catch((error) => {
                    displayClientError(error.message)
                })
        } else {
            loginOwner(data.get('email'))
                .then(async (res) => {
                    if (res.data) {
                        await signInWithEmailAndPassword(
                            auth,
                            data.get('email'),
                            data.get('password')
                        )
                        localStorage.setItem('isLoggedIn', 'true')
                        localStorage.setItem('isOwner', 'true')
                        sessionStorage.setItem('userId', res.data.ownerid) // todo: store userid at the backend instead of here
                        setTimeout(() => {
                            navigate('/owner/main')
                        }, AUTO_NAVIGATE_DELAY)
                    } else {
                        displayClientError('ERROR: Owner not found in DB')
                    }
                })
                .catch((error) => {
                    displayClientError(error.message)
                })
        }
    }

    const displayClientError = (msg) => {
        setErrorMsg(msg)
        setShowError(true)
        console.warn(msg)
    }

    return (
        <div>
            <Container component="div" maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        p: 6,
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" component="div" mb={3}>
                        Sign in
                    </Typography>

                    {showError && <Alert severity="error">{errorMsg}</Alert>}

                    <Box component="form" onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    id="email"
                                    label="Email"
                                    type="email"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    id="password"
                                    label="Password"
                                    type="password"
                                    required
                                />
                            </Grid>

                            {/* TODO: align checkbox  */}
                            <FormControlLabel
                                control={
                                    <Checkbox onChange={handleCheckboxChange} />
                                }
                                label="Sign in as Owner?"
                            />

                            <Grid item xs={12} sx={{ mb: 4, mt: 1 }}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                >
                                    Sign In
                                </Button>
                            </Grid>

                            <Grid item xs={6} sm={6}>
                                <Link href="#" variant="body1">
                                    Reset Your Password
                                </Link>
                            </Grid>
                            <Grid
                                item
                                container
                                xs={6}
                                sm={6}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignContent: 'flex-end',
                                }}
                            >
                                <Link href="/signupGuest" variant="body1">
                                    Sign Up
                                </Link>
                            </Grid>

                            <Grid
                                item
                                container
                                sm={12}
                                xs={12}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignContent: 'flex-end',
                                }}
                            >
                                <Link href="/signupRestaurant" variant="body1">
                                    Sign Up as an Owner
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </div>
    )
}
