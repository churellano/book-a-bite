import React from "react";
import { Box, Container, Paper, Grid, Typography } from "@mui/material";
import { TextField, Button, Link } from "@mui/material";
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from "../firebase-config";

export default function Login() {
  onAuthStateChanged(auth, (user) => {
    if (user !== null) {
      console.log(`user ${auth.currentUser.email} is already logged in!`);
    } else {
      console.log("No User Signed in (firebase onAuthStateChanged)");
    }
  });

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });
    const email = data.get("email");
    const password = data.get("password");
    login(email, password);
  };

  const login = async (loginEmail, loginPassword) => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <Container component="div" maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 6,
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="div" mb={3}>
            Sign in
          </Typography>

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
              <Grid item xs={12} sx={{ mb: 4, mt: 1 }}>
                <Button fullWidth type="submit" variant="contained">
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
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-end",
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
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-end",
                }}
              >
                <Link href="/signupRestaurant" variant="body1">
                  Sign Up as a Restaurant
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
