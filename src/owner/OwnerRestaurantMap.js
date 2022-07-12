import { Box, Container, Button } from "@mui/material";
import { useState } from "react";

import Navbar from "../common-components/Navbar"
import "./OwnerRestaurantMap.css"

// const onClick

export default function OwnerRestaurantMap() {
  const test = 10
  const [rows, setRows] = useState(test);
  const [columns, setColumns] = useState(test)
  const [cells, setCells] = useState(Array.from({ length: rows * columns}).map(
    (e, i) => ({ x: i % columns, y: Math.floor(i / rows), selected: false})
  ));
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState({ cells: [], capacity: null });
  const [isCreatingTable, setIsCreatingTable] = useState(false);

  const gridTemplateStyle = `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`

  const startCreatingTable = () => {
    // TODO: go into creating table mode, allow clicking on grid
    setIsCreatingTable(true);

  }

  const finishTable = () => {
    // TODO: find all newly clicked cells and create table object
    setIsCreatingTable(false);
  };

  const onCellClick = (clickedCell) => (clickObject) => {
    if (isCreatingTable) {
      cells.forEach(c => {
        console.log(c.x, clickedCell.x)
        console.log(c.y, clickedCell.y)
        if (c.x === clickedCell.x && c.y === clickedCell.y) {
          c.new = true;
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
        <Button onClick={startCreatingTable}>l Create Table Mode</Button>
        <div className="restaurant-map" style={{gridTemplate: gridTemplateStyle}}>
          {
            cells.map((cell, i) => <div key={i} className="table-cell" onClick={onCellClick(cell)} style={{ backgroundColor: cell.selected ? '#00ff00' : '#ffffff'}}>{`(${cell.x}, ${cell.y})`}</div>)
          }
        </div>
      </Container>
    </div>
  );
}