import { Box, Container } from "@mui/material";
import { useState } from "react";

import Navbar from "../common-components/Navbar"
import "./OwnerRestaurantMap.css"

// const onClick

export default function OwnerRestaurantMap() {
  const test = 10
  const [rows, setRows] = useState(test);
  const [columns, setColumns] = useState(test)
  const [cells, setCells] = useState(Array.from({ length: rows * columns}).map(
    (e, i) => ({ x: i % columns, y: i % rows })
  ))

  const gridTemplateStyle = `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`

  return (
    <div>
      <Navbar isGuestMode={false} />
      <Container>
        <div className="restaurant-map" style={{gridTemplate: gridTemplateStyle}}>
          {
            cells.map((cell, i) => <div key={i} className="table-cell" >{`(${cell.x}, ${cell.y})`}</div>)
          }
        </div>
      </Container>
    </div>
  );
}