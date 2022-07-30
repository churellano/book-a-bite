import { TabPanel } from "@mui/lab";
import { Typography, Box, TextField, Button } from "@mui/material";

export default function SetDimensionsTabPanel({
  rows,
  columns,
  handleChange,
  maxRows,
  maxColumns,
  onSetDimensions
}) {
  const isRowsValid = rows >= 0 && rows <= maxRows;
  const isColumnsValid = columns >= 0 && columns <= maxColumns;

  return (
    <TabPanel value="0">
        <Typography>Set the dimensions for your restaurant map</Typography>
        <Box
            sx={{
                '& .MuiTextField-root': { mt: 2, mr: 2 },
                mb: 2,
            }}
        >
            <TextField
                label="Width"
                name="width"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                value={rows}
                error={!isRowsValid}
                helperText={!isRowsValid ? `Width must be an integer in the range [0, ${maxRows}]` : null}
                onChange={handleChange}
            />
            <TextField
                label="Length"
                name="length"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                value={columns}
                error={!isColumnsValid}
                helperText={!isColumnsValid ? `Length must be an integer in the range [0, ${maxColumns}]` : null}
                onChange={handleChange}
            />
        </Box>
        <Button
            variant="contained"
            disabled={rows <= 0 || rows > maxRows || columns <= 0 || columns > maxColumns}
            onClick={onSetDimensions}
        >
            Set Dimensions
        </Button>
    </TabPanel>
  )
}