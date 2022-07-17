import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Grid } from "@mui/material";
import { Box } from "@mui/material";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Navbar from "../common-components/Navbar";
import RestaurantListItem from "../common-components/RestaurantListItem";

export default function OwnerMain() {
  const [restraurants, setRestraurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      // .get("http://localhost:8080/api/owner/main")
      .get("https://cmpt-372-project.uc.r.appspot.com/api/owner/main")
      .then((res) => {
        setRestraurants(res.data);
      })
      .catch((err) => console.error(err));
  }, []);


  const addRestaurant = () => { };
  return (
    <div>
      <Navbar isGuestMode={false} />
      <Grid container spacing={2}>
        {restraurants.map((rest) => (
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
