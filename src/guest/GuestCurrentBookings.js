import { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";

import Navbar from "../common-components/Navbar";
import RestaurantListItem from "../common-components/RestaurantListItem";

export default function GuestCurrentBookings(props) {
  const [restraurants, setRestraurants] = useState([]);

  useEffect(() => {
    axios
      // .get("http://localhost:8080/api/guest/currentBookings")
      .get("https://cmpt-372-project.uc.r.appspot.com/api/guest/currentBookings")
      .then((res) => {
        setRestraurants(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar isGuestMode={true} />
      <Typography variant="h4" component="div" mb={3} textAlign="center">
        Your Current Bookings
      </Typography>
      <Grid container spacing={2}>
        {restraurants.map((rest) => (
          <Grid key={rest.address} item xs={12} sm={6}>
            <RestaurantListItem data={rest} page="guestProfile" />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}