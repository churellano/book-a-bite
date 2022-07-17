import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Grid, Typography, Alert } from "@mui/material";
import { TextField, Button, Link } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { addOwner } from "../api/api";

export default function OwnerSignUp() {
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // listen for login state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setTimeout(() => {
        if (currentUser !== null) {
          // console.log(`user ${auth.currentUser.email} is logged in as a ${JSON.parse(localStorage.getItem("isOwner")) ? "Owner" : "Guest"}`);
          autoNavigateIfLoggedIn();
        } else {
          console.log("No User is signed in");
          localStorage.setItem("isLoggedIn", "false");
        }
      }, 500);
    });
    return () => {
      // prevents repeated calls
      unsubscribe();
    };
  }, []);

  const autoNavigateIfLoggedIn = () => {
    if (
      JSON.parse(localStorage.getItem("isLoggedIn")) &&
      !JSON.parse(localStorage.getItem("isOwner"))
    ) {
      navigate("/guest/main");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else if (
      JSON.parse(localStorage.getItem("isLoggedIn")) &&
      JSON.parse(localStorage.getItem("isOwner"))
    ) {
      navigate("/owner/main");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      console.log("cannot auto-navigate since not logged in");
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setShowError(false);
    register(data);
  };

  const register = async (data) => {
    addOwner(data)
      .then(async (res) => {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.get("email"),
          data.get("password")
        );
        console.log("New Owner Account Created!", res);
        localStorage.setItem("isOwner", "true");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
      })
      .catch((error) => {
        displayClientError(error.message);
      });
    // to access logged in user: $auth.currentUser.email
  };

  const displayClientError = (msg) => {
    setErrorMsg(msg);
    setShowError(true);
    console.warn(msg);
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
  );
}
