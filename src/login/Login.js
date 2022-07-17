import React, { useState } from "react";
import { Box, Container, Paper, Grid, Typography, Alert } from "@mui/material";
import { TextField, Button, Link } from "@mui/material";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { loginGuest, loginOwner } from "../api/api";

export default function Login() {
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

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
    setShowError(false);
    login(data);
  };

  const login = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.get("email"),
        data.get("password")
      );
      // TODO: Naviagte to correct path (Guest/Restaurant)

      // Retrieve user data from DB and create a session
      // try to login as a guest
      loginGuest(data.get("email"))
        .then((res) => {
          if (res.data) {
            // TODO: instead of storing userId in sessionStorage, store userId at the backend using express-session
            sessionStorage.setItem("userId", res.data.guestid);
            navigate("/guest/main");
          } else {
            console.log("Error: Guest not found");
          }
        })
        .catch((e) => console.error(e));

      // if guest login failed, try to login as owner
      loginOwner(data.get("email"))
        .then((res) => {
          if (res.data) {
            sessionStorage.setItem("userId", res.data.ownerid);
            navigate("/owner/main");
          } else {
            console.log("Error: Owner not found");
          }
        })
        .catch((e) => console.error(e));
      console.log(userCredential);
    } catch (error) {
      setShowError(true);
      setErrorMsg(error.message);
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
