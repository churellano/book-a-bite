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
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
} from 'firebase/auth'

import { auth } from '../firebase-config'
import { loginGuest, loginOwner } from '../api/api'

export default function Login() {
    const [errorMsg, setErrorMsg] = useState('')
    const [showError, setShowError] = useState(false)
    const [isOwnerChecked, setisOwnerChecked] = useState(false)
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const AUTO_NAVIGATE_DELAY = 2000

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handleCheckboxChange = () => {
        setisOwnerChecked(!isOwnerChecked)
    }

    const forgotPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent! Please check your email for a link")
            })
            .catch((error) => {
                displayFirebaseError(error)
            })
    }

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
            console.warn('cannot auto-navigate since not logged in')
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
            unsubscribe()
        }
    }, [autoNavigateIfLoggedIn])

    const submit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setShowError(false)
        login(data)
    }

    const login = (data) => {
        if (!isOwnerChecked) {
            loginGuest(data.get('email'))
                .then(async (res) => {
                    if (res.data) {
                        // firebase auth login
                        await signInWithEmailAndPassword(
                            auth,
                            data.get('email'),
                            data.get('password')
                        )
                        localStorage.setItem('isLoggedIn', 'true')
                        localStorage.setItem('isOwner', 'false')
                        // TODO: instead of storing userId in sessionStorage, store userId at the backend using express-session
                        sessionStorage.setItem('userId', res.data.guestid)
                        sessionStorage.setItem('userEmail', res.data.email)
                        setTimeout(() => {
                            navigate('/guest/main')
                        }, AUTO_NAVIGATE_DELAY)
                    } else {
                        // user not found in DB
                        setErrorMsg('Guest not found')
                        setShowError(true)
                    }
                })
                .catch((error) => {
                    displayFirebaseError(error)
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
                        sessionStorage.setItem('userEmail', res.data.email)
                        setTimeout(() => {
                            navigate('/owner/main')
                        }, AUTO_NAVIGATE_DELAY)
                    } else {
                        // user not found in DB
                        setErrorMsg('Owner not found')
                        setShowError(true)
                    }
                })
                .catch((error) => {
                    displayFirebaseError(error.message)
                })
        }
    }

    const displayFirebaseError = (e) => {
        switch (e.code) {
            case 'auth/wrong-password':
                setErrorMsg('Incorrect password. Please try again')
                break
            case 'auth/user-not-found':
                setErrorMsg(
                    'Please enter an existing email to reset your password'
                )
                break
            default:
                setErrorMsg('Unhandled Firebase Error')
                console.warn(e.message)
                break
        }
        setShowError(true)
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
                                    value={email}
                                    onChange={handleEmailChange}
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

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleCheckboxChange}
                                        sx={{ ml: 2 }}
                                    />
                                }
                                label="Sign in as Owner?"
                            />

                            <Grid item xs={12} sx={{ mt: 1 }}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                >
                                    Sign In
                                </Button>
                            </Grid>

                            <Grid item xs={6} sm={6}>
                                <Link
                                    href="#"
                                    variant="body1"
                                    onClickCapture={forgotPassword}
                                >
                                    Forgot Your Password?
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
                                    Sign Up as Owner
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </div>
    )
}
