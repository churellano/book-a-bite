import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Paper, Grid, Typography, Alert } from '@mui/material'
import { TextField, Button, Link } from '@mui/material'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth'

import { auth } from '../firebase-config'
import { addOwner } from '../api/api'

export default function OwnerSignUp() {
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    const autoNavigateIfLoggedIn = useCallback(() => {
        let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'))
        let isOwner = JSON.parse(localStorage.getItem('isOwner'))
        if (isLoggedIn && !isOwner) {
            navigate('/guest/main')
            setTimeout(() => {
                window.location.reload()
            }, 500)
        } else if (isLoggedIn && isOwner) {
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

    const submit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setShowError(false)
        register(data)
    }

    const register = async (data) => {
        addOwner(data)
            .then(async (res) => {
                await createUserWithEmailAndPassword(
                    auth,
                    data.get('email'),
                    data.get('password')
                )
                localStorage.setItem("isOwner", "true");
                localStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem('userId', res.data[0].ownerid)
                sessionStorage.setItem('userEmail', res.data[0].email)
                navigate('/')
            })
            .catch((error) => {
                displayClientError(error.message)
            })
        // to access logged in user: $auth.currentUser.email
    }

    const displayClientError = (msg) => {
        setErrorMsg(msg)
        setShowError(true)
        console.warn(msg)
    }

    return (
        <div>
            <Container component="main" maxWidth="sm">
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
                        Sign Up An Owner
                    </Typography>

                    {showError && <Alert severity="error">{errorMsg}</Alert>}

                    <Box component="form" onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="firstname"
                                    id="firstname"
                                    label="First Name"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="lastname"
                                    id="lastname"
                                    label="Last Name"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} mt={2}>
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
                        </Grid>

                        <Grid item xs={12} sx={{ mb: 5, mt: 1 }}>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{ mt: 5, mb: 1 }}
                            >
                                Sign Up
                            </Button>
                        </Grid>

                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/" variant="body1">
                                    Have an exisiting account? Sign In
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </div>
    )
}
