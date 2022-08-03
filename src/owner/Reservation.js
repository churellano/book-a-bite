import { Card, CardContent, CardActions, Button, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogTitle } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import TodayIcon from '@mui/icons-material/Today';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import { useEffect, useState } from "react";
import { deleteReservation, getProfileGuest } from "../api/api";

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export default function Reservation({
  reservation,
  // onDelete
}) {
  const [open, setOpen] = useState(false);

  const [guestUser, setGuestUser] = useState(null);

  useEffect(() => {
    getProfileGuest(reservation.guestid)
      .then(response => {
        setGuestUser(response.data);
      });
  }, []);

  const onDelete = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
  }

  const onReservationDeleteConfirmed = async (reservationid) => {
    try {
        await deleteReservation(reservationid)
        window.location.reload()
    } catch (e) {
        console.error(e)
    }
  };

  return (
    <>
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <CardContent sx={{ flex: '1 1 0' }}>
          <List component='div'>
            <ListItem>
              <ListItemIcon>
                  <TodayIcon />
              </ListItemIcon>
              <ListItemText>
                  {new Date(reservation.bookingtime).toLocaleDateString(
                      'en-CA',
                      options
                  )}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                  <PersonIcon />
              </ListItemIcon>
              <ListItemText>
                  {guestUser ? `${guestUser.fname} ${guestUser.lname}` : null}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                  <PhoneIcon />
              </ListItemIcon>
              <ListItemText>
                  {guestUser ? `${guestUser.phone}` : null}
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                  <TableRestaurantIcon />
              </ListItemIcon>
              <ListItemText>
                  Reserved table: {reservation.tableid}
              </ListItemText>
            </ListItem>
            {reservation.note && reservation.note.length ? 
              <ListItem>
                  <ListItemIcon>
                      <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText>
                      Guest note: {reservation.note}
                  </ListItemText>
              </ListItem> : null
            }
        </List>
        </CardContent>
        <CardActions sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'end',
            gap: 1
        }}>
            <Button
                onClick={onDelete}
                color="error"
                variant='contained'
            >
                Delete booking
            </Button>
        </CardActions>
      </Card>
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">
              Are you sure you want to delete the guest's reservation?
          </DialogTitle>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose} autoFocus>
                Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => onReservationDeleteConfirmed(reservation.reservationid)}
            >
              Delete
            </Button>
          </DialogActions>
      </Dialog>
    </>
  );
}