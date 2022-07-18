import { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { Box } from "@mui/material";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Navbar from "../common-components/Navbar";
import RestaurantListItem from "../common-components/RestaurantListItem";
import { addRestaurantOwner, getAllRestaurantsOwner } from "../api/api";

const mockTables = [
  {
    id: 1,
    restaurantId: 1,
    name: "Table 1",
    capacity: 3,
    cells: [
      {
        tableId: 1,
        x: 0,
        y: 0,
        selected: true,
        isPartOfTable: true,
      },
      {
        tableId: 1,
        x: 1,
        y: 0,
        selected: true,
        isPartOfTable: true,
      },
      {
        tableId: 1,
        x: 2,
        y: 0,
        selected: true,
        isPartOfTable: true,
      },
    ],
  },
  {
    id: 2,
    restaurantId: 1,
    name: "Table 2",
    capacity: 6,
    cells: [
      {
        tableId: 2,
        x: 7,
        y: 9,
        selected: true,
        isPartOfTable: true,
      },
      {
        tableId: 2,
        x: 8,
        y: 9,
        selected: true,
        isPartOfTable: true,
      },
      {
        tableId: 2,
        x: 9,
        y: 9,
        selected: true,
        isPartOfTable: true,
      },
    ],
  },
];

const MOCK_RESTAURANT = {
  ownerId: sessionStorage.getItem("userId"),
  name: "mock_rest",
  address: "Test address",
  phone: "11111111",
  openingTime: 12,
  closingTime: 22,
  mininumReservationDuration: 1.5,
  reservationInterval: 0.5,
  mapNumOfRows: 10,
  mapNumOfCols: 10,
  tables: JSON.stringify(mockTables),
  capacity: 50,
};

export default function OwnerMain() {
  const [restraurants, setRestraurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllRestaurantsOwner()
      .then((res) => {
        setRestraurants(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const addRestaurant = async () => {
    // try {
    //   let res = await addRestaurantOwner(MOCK_RESTAURANT);
    //   console.log("Added new restaurant", res);
    //   window.location.reload();
    // } catch (err) {
    //   console.error(err);
    // }
  };

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
