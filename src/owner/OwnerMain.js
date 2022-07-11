import { Button, Grid } from "@mui/material";
import { Box } from "@mui/material";

import Navbar from "../common-components/Navbar";
import RestaurantListItem from "../common-components/RestaurantListItem";
import testRestaurants from "../testRestaurants";

export default function OwnerMain() {
  const addRestaurant = () => {};
  return (
    <div>
      <Navbar isGuestMode={false} />
      <Grid container spacing={2}>
        {testRestaurants.map((rest) => (
          <Grid item xs={12} sm={6}>
            <RestaurantListItem data={rest} page="ownerMain" />
          </Grid>
        ))}
      </Grid>
      <Box textAlign="center">
        <Button
          sx={{ mt: 5 }}
          variant="contained"
          color="success"
          size="large"
          onClick={addRestaurant}
        >
          Add Restaurant
        </Button>
      </Box>
      {/* TODO: Add Google Maps */}
    </div>
  );
}