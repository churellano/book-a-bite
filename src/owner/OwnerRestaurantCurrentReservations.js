import { Typography, Container, Box, CircularProgress, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getReservationsByRestaurantIdOwner } from "../api/api";
import Navbar from "../common-components/Navbar";
import Reservation from "./Reservation";

export default function OwnerRestaurantReservations() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);

  const location = useLocation()
  const { restaurantid: restaurantId, name } = location.state;

  useEffect(() => {
    getReservationsByRestaurantIdOwner(restaurantId)
        .then((response) => {
            setReservations(response.data);
            setIsLoading(false);
        })
        .catch((err) => console.error(err))
  }, [])
  
  return (
    <>
      <Navbar isGuestMode={false} />
      <Typography variant="h4" component="div" mb={3} textAlign="center">
          Current Reservations at {name}
      </Typography>
      <Container>
          {isLoading ? (
              <Box sx={{
                  display: 'flex',
                  justifyContent: 'center'
              }}>
                  <CircularProgress />
              </Box> 
          ) : reservations.length ? (
                  <Grid container spacing={2}>
                      {reservations.map((reservation) => (
                          <Grid
                              key={reservation.reservationid}
                              item
                              xs={12}
                              sm={6}
                          >
                              <Reservation
                                reservation={reservation}
                              />
                          </Grid>
                      ))}
                  </Grid> 
              ) : (
                  <Box sx={{
                      textAlign: 'center'
                  }}>
                      <Typography>No reservations booked at this restaurant.</Typography>
                  </Box>
              )
          }
        </Container>
        
    </>
  )
}