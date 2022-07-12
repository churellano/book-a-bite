import React from 'react'
import { Box, Container, Paper, Grid, Typography } from "@mui/material";
import { TextField, Button, Link } from "@mui/material";


export default function Login() {
    const submit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

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

                    <Box component="form" onSubmit={submit} >
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
                            <Grid item xs={12} sx={{ mb: 5, mt: 1 }} >
                                <Button fullWidth type="submit" variant="contained">
                                    Sign In
                                </Button>
                            </Grid>

                            <Grid item xs={10}>
                                <Link href="#" variant="body1">
                                    Reset Your Password
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/login/signup" variant="body1">
                                    Sign Up
                                </Link>
                            </Grid>

                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </div >
    )
}

