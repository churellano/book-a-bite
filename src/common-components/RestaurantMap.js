import { Box } from "@mui/material";
import Utility from '../utility';
import "./RestaurantMap.css";

const getCellColour = (cell) => {
  let color = '#ffffff';
  if (cell.selected && cell.isPartOfNewTable) {
    color = '#0000ff';
  } else if (cell.selected && !cell.isPartOfNewTable) {
    color = '#00ff00';
  }

  return color;
}

export default function RestaurantMap({
  rows,
  columns,
  tables,
  cells,
  onCellClick,
  isGuestMode
}) {
  const gridTemplate = `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`
  let displayCells = cells;

  const cellsFromTables = Utility.createCellsArray(rows, columns);
  if (isGuestMode && tables && tables.length) {
    tables.forEach(table => {
      cellsFromTables.forEach(cell => {
        table.cells.forEach(tableCell => {
          if (cell.x === tableCell.x && cell.y === tableCell.y) {
            cell.selected = true;
            cell.isPartOfNewTable = tableCell.isPartOfNewTable;
            cell.tableId = table.id;
          }
        })
      })
    });

    displayCells = cellsFromTables;
  }

  return (
    <Box className="restaurant-map" style={{gridTemplate}}>
      {
        displayCells.map((cell, i) => (
          <div 
            key={i}
            className="table-cell"
            onClick={onCellClick(cell)}
            style={{
              backgroundColor: getCellColour(cell),
              cursor: isGuestMode ?
                (cell.selected ? 'pointer' : 'default') :
                (cell.isPartOfNewTable ? 'default' : 'pointer')
            }}
          >
            {`(${cell.x}, ${cell.y})`}
          </div>
        ))
      }
    </Box>
  )
}