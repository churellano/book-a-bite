import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Paper, Grid, Typography } from "@mui/material";
import { TextField, Button, Link } from "@mui/material";
import { loginGuest, loginOwner } from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // TODO: authenticate through Identity Platform
    let authenticated = true;

    if (authenticated) {
      // try to login as a guest
      loginGuest(data.get("email"))
        .then((res) => {
          if (res.data) {
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
            navigate("/owner/main");
          } else {
            console.log("Error: Owner not found");
          }
        })
        .catch((e) => console.error(e));
    }

    // TODO: handle user not found at the front end
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
