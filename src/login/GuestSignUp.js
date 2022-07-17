import React, { useState } from "react";
import { Box, Container, Paper, Grid, Typography, Alert } from "@mui/material";
import { TextField, Button, Link } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { addGuest } from "../api/api";

export default function GuestSignUp() {
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setShowError(false);
    register(data);
  };

  const register = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.get("email"),
        data.get("password")
      );
      // Add guest to DB
      addGuest(data)
        .then((res) => {
          console.log("New Guest Account Created!", res);
          console.log(userCredential);
          navigate("/");
        })
        .catch((err) => console.error(err));
    } catch (error) {
      setShowError(true);
      setErrorMsg(error.message);
      console.log(error.message);
    }
    // to access logged in user: $auth.currentUser.email
  };

  return (
    <div>
      <Container component="main" maxWidth="sm">
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
            Sign up
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
  );
}
