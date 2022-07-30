import { Box } from '@mui/material'

import './RestaurantMap.css'

const getCellColour = (cell) => {
    let color = '#ffffff' // White
    if (cell.isPartOfFinishedTable && !cell.isMarkedForDeletion) {
        color = '#0000ff' // Blue
    } else if (cell.selected) {
        // Green
        color = '#00ff00' // Green
    }

    return color
}

function getCursorStyle(mode, cell) {
    let cursorStyle = 'default';
    if (mode === 'create') {
        // Creating new tables
        cursorStyle = cell.selected || cell.isPartOfFinishedTable ? 'default' : 'pointer';
    } else if (mode === 'delete' || mode === 'guestView') {
        // Deleting tables or viewing table map as guest
        cursorStyle = cell.isPartOfFinishedTable ?  'pointer' : 'default';
    } else if (mode === 'ownerView') {
        // Viewing table map as owner
        cursorStyle = 'default'
    }

    return cursorStyle;
}

export default function RestaurantMap({
    rows,
    columns,
    cells,
    onCellClick,
    mode
}) {
    const gridTemplate = `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`
    return (
        <Box className="restaurant-map" style={{ gridTemplate }}>
            {cells.map((cell, i) => (
                <div
                    key={i}
                    className="table-cell"
                    onClick={onCellClick(cell)}
                    style={{
                        backgroundColor: getCellColour(cell),
                        cursor: getCursorStyle(mode, cell)
                    }}
                >
                    {`(${cell.x}, ${cell.y})`}
                </div>
            ))}
        </Box>
    )
}
