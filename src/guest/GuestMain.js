import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../common-components/Navbar";
import RestaurantListItem from "../common-components/RestaurantListItem";

export default function GuestMain() {
  const [restraurants, setRestraurants] = useState([]);

  useEffect(() => {
    axios
      // .get("http://localhost:8080/api/guest/main")
      .get("https://cmpt-372-project.uc.r.appspot.com/api/guest/main")
      .then((res) => {
        setRestraurants(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar isGuestMode={true} />
      <Typography variant="h4" component="div" mb={3} textAlign="center">
        Book a Table!
      </Typography>
      <Grid container spacing={2}>
        {restraurants.map((rest) => (
          <Grid item xs={12} sm={6}>
            <RestaurantListItem data={rest} page="guestMain" />
          </Grid>
        ))}
      </Grid>
      {/* TODO: Add Google Maps */}
    </div>
  );
}
