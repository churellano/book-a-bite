import { Box, Button, Container } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../common-components/Navbar";
import OwnerRestaurantProfile from "./OwnerRestaurantProfile";
import OwnerRestaurantMap from "./OwnerRestaurantMap";
import Utility from "../utility";
import { saveRestaurantOwner } from "../api/api";
import { useLocation } from "react-router-dom";

const DEFAULT_ROWS = 10;
const DEFAULT_COLUMNS = 10;

export default function OwnerRestaurantDetails() {
  let location = useLocation();

  const [tab, setTab] = useState("0");
  const [name, setName] = useState(
    location.state ? location.state.data.name : ""
  );
  const [address, setAddress] = useState(
    location.state ? location.state.data.address : ""
  );
  const [phone, setPhone] = useState(
    location.state ? location.state.data.phone : ""
  );
  const [capacity, setCapacity] = useState(
    location.state ? location.state.data.capacity : 0
  );
  const [openingTime, setOpeningTime] = useState(
    location.state
      ? Utility.hoursToTimeString(location.state.data.openingtime)
      : "00:00"
  );
  const [closingTime, setClosingTime] = useState("10:00");
  const [mininumReservationDuration, setMininumReservationDuration] = useState(
    location.state
      ? Math.round(location.state.data.minimumreservationduration * 60)
      : 60
  );
  const [reservationInterval, setReservationInterval] = useState(
    location.state
      ? Math.round(location.state.data.reservationinterval * 60)
      : 30
  );

  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [tables, setTables] = useState(
    location.state ? location.state.data.tables : []
  );
  const [tableCapacity, setTableCapacity] = useState(0);

  const navigate = useNavigate();

  const ownerRestaurantProfileProps = {
    name,
    address,
    phone,
    capacity,
    openingTime,
    closingTime,
    mininumReservationDuration,
    reservationInterval,
    setName,
    setAddress,
    setPhone,
    setCapacity,
    setOpeningTime,
    setClosingTime,
    setMininumReservationDuration,
    setReservationInterval,
  };

  const ownerRestaurantMapProps = {
    rows,
    columns,
    tables,
    tableCapacity,
    setRows,
    setColumns,
    setTables,
    setTableCapacity,
  };

  const saveRestaurantDetails = async () => {
    try {
      const restaurant = {
        restaurantId: location.state ? location.state.data.restaurantid : null,
        ownerId: sessionStorage.getItem("userId"),
        name,
        address,
        phone,
        capacity,
        openingTime: Utility.timeStringToHours(openingTime),
        closingTime: Utility.timeStringToHours(closingTime),
        mininumReservationDuration: Utility.minutesToHours(
          mininumReservationDuration
        ),
        reservationInterval: Utility.minutesToHours(reservationInterval),
        mapNumOfRows: rows,
        mapNumOfCols: columns,
        tables: JSON.stringify(tables),
      };

      console.log("Saving restaurant: ", restaurant);

      const result = await saveRestaurantOwner(restaurant);

      console.log("saveRestaurantDetails result: ", result);
      navigate("/owner/main");
    } catch (error) {
      console.error("Error: Failed to create restaurant");
    }
  };

  return (
    <div>
      <Navbar isGuestMode={false} />
      <Container>
        <TabContext value={tab}>
          <Box>
            <Button variant="contained" onClick={() => saveRestaurantDetails()}>
              Save Restaurant
            </Button>
            <TabList onChange={(e, newTab) => setTab(newTab)}>
              <Tab label="Restaurant information" value="0" />
              <Tab label="Restaurant map" value="1" />
            </TabList>
          </Box>
          <TabPanel value="0">
            <OwnerRestaurantProfile {...ownerRestaurantProfileProps} />
          </TabPanel>
          <TabPanel value="1">
            <OwnerRestaurantMap {...ownerRestaurantMapProps} />
          </TabPanel>
        </TabContext>
      </Container>
      `
    </div>
  );
}
