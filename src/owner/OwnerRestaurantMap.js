import { Box, Container, Button, ButtonGroup, TextField } from "@mui/material";
import { useState } from "react";

import Navbar from "../common-components/Navbar"
import "./OwnerRestaurantMap.css"

const getCellColour = (cell) => {
  let color = '#ffffff';
  if (cell.selected && cell.isPartOfTable) {
    color = '#0000ff';
  } else if (cell.selected && !cell.isPartOfTable) {
    color = '#00ff00';
  }

  return color;
}

export default function OwnerRestaurantMap() {
  const test = 10
  const [rows, setRows] = useState(test);
  const [columns, setColumns] = useState(test)
  const [cells, setCells] = useState(Array.from({ length: rows * columns}).map(
    (e, i) => ({
        x: i % columns,
        y: Math.floor(i / rows),
        selected: false,
        isPartOfTable: false
      })
  ));
  const [tables, setTables] = useState([]);
  // const [currentTable, setCurrentTable] = useState({ cells: [], capacity: null }); 
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [guestCapacity, setGuestCapacity] = useState(0);

  const gridTemplateStyle = `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`

  const startCreatingTable = () => {
    // TODO: go into creating table mode, allow clicking on grid
    // setCurrentTable({ cells: [], capacity: null });
    setIsCreatingTable(true);
  }

  const finishTable = () => {
    const table = {
      capacity: guestCapacity,
      cells: cells.filter(c => c.selected === true)
    };

    cells.forEach(c => {
      if (c.selected) {
        c.isPartOfTable = true;
      }
    })

    // Remove new property so that tables created after do not include these cells
    setCells([...cells])

    // Add new table to array
    setTables([...tables, table])
    setGuestCapacity(0);
    setIsCreatingTable(false);
  };

  // Resets selected cells
  const cancelTable = () => {
    cells.forEach(c => {
      if (c.selected && !c.isPartOfTable) {
        c.selected = false;
      }
    });

    setCells([...cells]);

    setIsCreatingTable(false);
  };

  // TODO: make post request to back end to save
  const saveRestaurantMap = () => {
    const restaurantMap = { tables };
    console.log('Debug: Saving ', restaurantMap);
  };

  // Mark cells as being part of a table
  const onCellClick = (clickedCell) => (clickObject) => {
    if (isCreatingTable) {
      cells.forEach(c => {
        if (c.x === clickedCell.x && c.y === clickedCell.y && !c.isPartOfTable) {
          c.selected = !c.selected;
        }
      });
      setCells([...cells]);
    }
  }

  return (
    <div>
      <Navbar isGuestMode={false} />
      <Container>
        <Box sx={{
          '& > *': {
            m: 1,
          },
        }}>
          <Button variant="contained" onClick={startCreatingTable} disabled={isCreatingTable}>Start Creating A Table</Button>
          <ButtonGroup ml={2}>
            <Button variant="contained" color="success" onClick={finishTable}  disabled={!isCreatingTable || !guestCapacity}>Finish Table</Button>
            <Button variant="contained" onClick={cancelTable}  disabled={!isCreatingTable}>Cancel Table</Button>
          </ButtonGroup>
          <Button variant="outlined" onClick={saveRestaurantMap} disabled={isCreatingTable}>Save Restaurant Map</Button>
        </Box>
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
        <Box className="restaurant-map" mt={2} style={{gridTemplate: gridTemplateStyle}}>
          {
            cells.map((cell, i) => (
              <div 
                key={i}
                className="table-cell"
                onClick={onCellClick(cell)}
                style={{ backgroundColor: getCellColour(cell)}}
              >
                {`(${cell.x}, ${cell.y})`}
              </div>
            ))
          }
        </Box>
      </Container>
    </div>
  );
}