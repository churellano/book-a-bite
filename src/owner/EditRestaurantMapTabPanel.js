import { TabPanel } from "@mui/lab";
import { Box, Button, ButtonGroup, TextField } from "@mui/material";
import RestaurantMap from "../common-components/RestaurantMap";

export default function EditRestaurantMapTabPanel({
  mapMode,
  rows,
  columns,
  cells,
  onCellClick,
  tableCapacity,
  setTableCapacity,
  isCreatingTable,
  startCreatingTable,
  cancelTable,
  finishTable,
  tablesToDelete,
  isDeletingTables,
  startDeletingTables,
  stopDeletingTables,
  confirmTableDeletes,
}) {
  return (
    <TabPanel value="2">
        <Box
            sx={{
                '& > *': {
                    mr: 1,
                },
            }}
        >
            <Button
                variant="contained"
                onClick={startCreatingTable}
                disabled={isCreatingTable || isDeletingTables}
            >
                Start Creating A Table
            </Button>
            <ButtonGroup>
                <Button
                    variant="contained"
                    color="success"
                    onClick={finishTable}
                    disabled={!isCreatingTable || !tableCapacity}
                >
                    Finish Table
                </Button>
                <Button
                    variant="contained"
                    onClick={cancelTable}
                    disabled={!isCreatingTable}
                >
                    Cancel Table
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    variant="contained"
                    color='error'
                    onClick={isDeletingTables ? confirmTableDeletes : startDeletingTables}
                    disabled={isCreatingTable || (isDeletingTables && !tablesToDelete.length)}
                >
                    {isDeletingTables ? "Confirm Delete" : "Start Deleting Tables"}
                </Button>
                <Button
                    variant="contained"
                    onClick={stopDeletingTables}
                    disabled={!isDeletingTables}
                >
                    Cancel Delete Table
                </Button>
            </ButtonGroup>
            <Box my={2}>
                <TextField
                    label="Guest capacity for this table"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="standard"
                    value={tableCapacity}
                    error={isCreatingTable && tableCapacity <= 0}
                    helperText={isCreatingTable && tableCapacity <= 0 ? 'Table must seat at least 1 person.' : null}
                    onChange={(e) => setTableCapacity(parseInt(e.target.value, 10))}
                    disabled={!isCreatingTable}
                />
            </Box>
            <RestaurantMap
                rows={rows}
                columns={columns}
                cells={cells}
                onCellClick={onCellClick}
                mode={mapMode}
            />
        </Box>
    </TabPanel>
  );
}