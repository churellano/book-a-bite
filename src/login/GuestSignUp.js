import React from 'react'
import { Box, Container, Paper, Grid, Typography } from "@mui/material";
import { TextField, Button, Link } from "@mui/material";

export default function GuestSignUp() {
    const submit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            fname: data.get('firstname'),
            lname: data.get('lastname'),
            phone: data.get('phone'),
            email: data.get('email'),
            password: data.get('password')
        });
    };

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
                        Sign up
                    </Typography>

                    <Box component="form" onSubmit={submit} >
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
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="phone"
                                    id="phone"
                                    label="Phone Number"
                                />
                            </Grid>
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
                        </Grid>

                        <Grid item xs={12} sx={{ mb: 5, mt: 1 }} >
                            <Button fullWidth type="submit" variant="contained" sx={{ mt: 5, mb: 1 }}>
                                Sign Up
                            </Button>
                        </Grid>

                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body1">
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
