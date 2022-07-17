import { Box, Container, Button, ButtonGroup, TextField, Typography } from "@mui/material";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from "react";

import Navbar from "../common-components/Navbar";
import RestaurantMap from "../common-components/RestaurantMap";
import Utility from "../utility";

const DEFAULT_ROWS = 10;
const DEFAULT_COLUMNS = 10;

export default function OwnerRestaurantMap() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [cells, setCells] = useState(Utility.createCellsArray(rows, columns));
  const [tables, setTables] = useState([]);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [guestCapacity, setGuestCapacity] = useState(0);
  const [tab, setTab] = useState("0");

  const startCreatingTable = () => {
    setIsCreatingTable(true);
  }

  const finishTable = () => {
    const table = {
      capacity: guestCapacity,
      cells: cells.filter(c => c.selected === true)
    };

    cells.forEach(c => {
      if (c.selected) {
        c.isPartOfNewTable = true;
      }
    })

    setCells([...cells])

    // Add new table to array
    setTables([...tables, table])
    setGuestCapacity(0);
    setIsCreatingTable(false);
  };

  // Resets selected cells
  const cancelTable = () => {
    cells.forEach(c => {
      if (c.selected && !c.isPartOfNewTable) {
        c.selected = false;
      }
    });

    setCells([...cells]);

    setIsCreatingTable(false);
  };

  // TODO: make post request to back end to save
  const saveRestaurantMap = () => {
    const restaurantMap = {
      rows,
      columns,
      tables
    };
    console.log('Debug: Saving ', restaurantMap);
  };

  // Mark cells as being part of a table
  const onCellClick = (clickedCell) => (clickObject) => {
    if (isCreatingTable) {
      cells.forEach(c => {
        if (c.x === clickedCell.x && c.y === clickedCell.y && !c.isPartOfNewTable) {
          c.selected = !c.selected;
        }
      });
      setCells([...cells]);
    }
  }

  // Reset values when changing restaurant map dimensions
  const onSetDimensions = () => {
    setCells(Utility.createCellsArray(rows, columns));
    setTables([]);
    setIsCreatingTable(false);
    setGuestCapacity(0);
    setTab("1");
  };

  const SetDimensionsTabPanel = () => (
    <TabPanel value="0">
      <Typography>Set the dimensions for your restaurant map</Typography>
      <Box sx={{
        '& .MuiTextField-root': { mt: 2, mr: 2 },
        mb: 2
      }}>
        <TextField
          label="Width"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={rows}
          error={rows <= 0}
          helperText={rows <= 0 && "Width must be greater than 0"}
          onChange={e => setRows(e.target.value)}
        />
        <TextField
          label="Length"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={columns}
          error={columns <= 0}
          helperText={columns <= 0 && "Width must be greater than 0"}
          onChange={e => setColumns(e.target.value)}
        />
      </Box>
      <Button
        variant="contained"
        disabled={rows <= 0 || columns <= 0}
        onClick={onSetDimensions}
      >
        Set Dimensions
      </Button>
    </TabPanel>
  );

  // const restaurantMap = {
  //   rows,
  //   columns,
  //   tables
  // }

  const CreateRestaurantMapTabPanel = () => (
    <TabPanel value="1">
      <Box sx={{
          '& > *': {
            mr: 1,
          },
      }}>
        <Button
          variant="contained"
          onClick={startCreatingTable}
          disabled={isCreatingTable}>
          Start Creating A Table
        </Button>
        <ButtonGroup>
          <Button
            variant="contained"
            color="success"
            onClick={finishTable}
            disabled={!isCreatingTable || !guestCapacity}>
            Finish Table
          </Button>
          <Button
            variant="contained"
            onClick={cancelTable}
            disabled={!isCreatingTable}>
            Cancel Table
          </Button>
        </ButtonGroup>
        <Button
          variant="outlined"
          onClick={saveRestaurantMap}
          disabled={isCreatingTable}>
          Save Restaurant Map
        </Button>
      </Box>
      <Box my={2}>
        <TextField
          label="Guest capacity for this table"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
          value={guestCapacity}
          onChange={e => setGuestCapacity(e.target.value)}
          disabled={!isCreatingTable}
        />
      </Box>
      <RestaurantMap
        rows={rows}
        columns={columns}
        tables={tables}
        cells={cells}
        onCellClick={onCellClick}
        isGuestMode={false}
      />
    </TabPanel>
  );

  return (
    <div>
      <Navbar isGuestMode={false} />
      <Container>
        <TabContext value={tab}>
          <Box>
            <TabList onChange={(e, newTab) => setTab(newTab)}>
              <Tab label="Set Map Dimensions" value="0" />
              <Tab label="Create Table Layout" value="1" disabled={cells.length !== rows * columns} />
            </TabList>
          </Box>
          <SetDimensionsTabPanel />
          <CreateRestaurantMapTabPanel />
        </TabContext>
      </Container>
    </div>
  );
}