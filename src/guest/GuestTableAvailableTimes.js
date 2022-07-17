import { Box, List, ListItemButton, Paper, Typography } from "@mui/material";

function formatTime(date) {
  // Change hour 0 to 12 midnight if needed
  let hour = date.getHours() % 12;
  const period = date.getHours() < 12 ? 'am' : 'pm';
  hour = hour ? hour : 12;

  // Add 0 if minute is single digit
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = minute.toString()+ '0';
  }
  
  return `${hour}:${minute}${period}`
}

export default function GuestTableAvailableTimes({
  availableTimes
}) {
  return (
    <Box>
      <Typography variant="h5">Available times</Typography>
      <Paper elevation={2} sx={{
          overflowY: 'auto',
          maxHeight: '100%'
      }}>
        <List>
          {
            availableTimes.map((time, index) => (
              <ListItemButton key={index} alignItems="center" divider={true}>
                <Typography variant="h6">{formatTime(time)}</Typography>
              </ListItemButton>
            ))
          }
        </List>
      </Paper>
    </Box>
  );
}