import { Grid, Typography } from "@mui/material";

import Navbar from "../common-components/Navbar";
import RestaurantListItem from "../common-components/RestaurantListItem";
import testRestaurants from "../testRestaurants";

export default function GuestMain() {
  return (
    <div>
      <Navbar isGuestMode={true} />
      <Typography variant="h4" component="div" mb={3} textAlign="center">
        Book a Table!
      </Typography>
      <Grid container spacing={2}>
        {testRestaurants.map((rest) => (
          <Grid item xs={12} sm={6}>
            <RestaurantListItem data={rest} page="guestMain" />
          </Grid>
        ))}
      </Grid>
      {/* TODO: Add Google Maps */}
    </div>
  );
}