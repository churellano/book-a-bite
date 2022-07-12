import React from 'react'
import { Box, Container, Paper, Grid, Typography } from "@mui/material";
import { TextField, Button, Link } from "@mui/material";

export default function RestaurantSignUp() {
    const submit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            RestaurantName: data.get('restaurantName'),
            RestaurantAddress: data.get('address'),
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
                        Sign Up A Restaurant
                    </Typography>

                    <Box component="form" onSubmit={submit} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    name="restaurantName"
                                    id="restaurantName"
                                    label="Name of Restaurant"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="address"
                                    id="address"
                                    label="Restaurant Address"
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
