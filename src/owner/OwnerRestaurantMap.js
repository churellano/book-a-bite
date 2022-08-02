import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Utility from '../utility'
import SetDimensionsTabPanel from './SetDimensionsTabPanel'
import CreateRestaurantMapTabPanel from './CreateRestaurantMapTabPanel'
import EditRestaurantMapTabPanel from './EditRestaurantMapTabPanel'

const MAX_ROWS = 30;
const MAX_COLUMNS = 30;

export default function OwnerRestaurantMap({
    restaurantId,
    rows,
    columns,
    tables,
    tableCapacity,
    isCreatingNewTableLayout,
    setRows,
    setColumns,
    setTables,
    setTableCapacity,
}) {
    const [cells, setCells] = useState(
        Utility.copyTableCellsToCellsArray(
            tables,
            Utility.createCellsArray(rows, columns)
        )
    );
    const [isCreatingTable, setIsCreatingTable] = useState(false);
    const [isDeletingTables, setIsDeletingTables] = useState(false);
    const [tab, setTab] = useState(isCreatingNewTableLayout ? '0' : '2');
    
    // Automatically switch to map dimensions tab if owner chooses to create a new map
    useEffect(() => {
        if (isCreatingNewTableLayout) {
            setTab('0');
        }
    }, [isCreatingNewTableLayout]);

    // Get max tableId or start from 0
    const [nextTableId, setNextTableId] = useState(
        tables.length ? Math.max(...tables.map(t => t.id)) + 1 : 0
    );
    const [tablesToDelete, setTablesToDelete] = useState([]);

    const resetNextTableId = () => setNextTableId(
        tables.length ? Math.max(...tables.map(t => t.id)) + 1 : 0
    );

    const startCreatingTable = () => {
        setIsCreatingTable(true);
    }

    const startDeletingTables = () => {
        setIsDeletingTables(true);
    }

    const confirmTableDeletes = () => {
        // Reset cells
        setCells(Utility.copyTableCellsToCellsArray(
            tables,
            Utility.createCellsArray(rows, columns)
        ));

        resetNextTableId();

        setIsDeletingTables(false);
    }

    // Restore deleted tables to the view
    const stopDeletingTables = () => {
        const restoredTables = [...tables, ...tablesToDelete]

        setCells(Utility.copyTableCellsToCellsArray(
            restoredTables,
            Utility.createCellsArray(rows, columns)
        ));

        setTables(restoredTables);
        setTablesToDelete([]);
        resetNextTableId();

        setIsDeletingTables(false);
    }

    const finishTable = () => {
        const table = {
            id: nextTableId,
            restaurantId,
            capacity: tableCapacity,
            cells: cells.filter((c) => c.selected === true),
        }

        setNextTableId(nextTableId + 1);

        cells.forEach((c) => {
            if (c.selected) {
                c.tableId = nextTableId
                c.isPartOfFinishedTable = true
                c.selected = false;
            }
        })

        setCells([...cells])

        // Add new table to array
        setTables([...tables, table])
        setTableCapacity(0)
        setIsCreatingTable(false)
    }

    // Resets selected cells
    const cancelTable = () => {
        cells.forEach((c) => {
            if (c.selected && !c.isPartOfFinishedTable) {
                c.selected = false
            }
        })

        setCells([...cells])

        setIsCreatingTable(false)
    }

    // Handles different cell click behaviours depending on whether the owner is
    // Creating new tables or deleting existing tables
    const onCellClick = (clickedCell) => (clickObject) => {
        if (isCreatingTable) {
            cells.forEach((c) => {
                if (
                    c.x === clickedCell.x &&
                    c.y === clickedCell.y &&
                    !c.isPartOfFinishedTable
                ) {
                    c.selected = !c.selected
                }
            })
            setCells([...cells])
        } else if (isDeletingTables) {
            const tableIdToDelete = clickedCell.tableId;
            const tableToDelete = tables.find(t => t.id === tableIdToDelete);

            // Move table to tablesToDelete array
            setTables([...tables.filter(t => t.id !== tableIdToDelete)]);
            setTablesToDelete([
                ...tablesToDelete,
                tableToDelete
            ]);

            // Mark the cells of the specified table to remove them from view
            cells.forEach((c) => {
                if (c.tableId === tableIdToDelete) {
                    c.isMarkedForDeletion = true;
                }
            });

            setCells([...cells]);
        }
    }

    const handleChange = (event) => {
       const { name, value } = event.target;
       switch (name) {
        case 'width':
            if (value > MAX_ROWS) {
                setRows(MAX_ROWS);
            } else {
                setRows(parseInt(value, 10));
            }
            break;
        case 'length':
            if (value > MAX_COLUMNS) {
                setColumns(MAX_COLUMNS);
            } else {
                setColumns(parseInt(value, 10));
            }
            break;
        default:
            return;
       }
    }

    // Reset values when changing restaurant map dimensions
    const onSetDimensions = () => {
        setCells(Utility.createCellsArray(rows, columns))
        setTables([])
        setIsCreatingTable(false)
        setTableCapacity(0)
        setTab('1')
    }
    
    let mapMode = 'ownerView';
    if (isCreatingTable) {
        mapMode = 'create';
    } else if (isDeletingTables) {
        mapMode = 'delete'
    }
    
    // const EditRestaurantMapTabPanel = () => (
    //     <TabPanel value="2">
    //         <Box
    //             sx={{
    //                 '& > *': {
    //                     mr: 1,
    //                 },
    //             }}
    //         >
    //             <Button
    //                 variant="contained"
    //                 onClick={startCreatingTable}
    //                 disabled={isCreatingTable || isDeletingTables}
    //             >
    //                 Start Creating A Table
    //             </Button>
    //             <ButtonGroup>
    //                 <Button
    //                     variant="contained"
    //                     color="success"
    //                     onClick={finishTable}
    //                     disabled={!isCreatingTable || !tableCapacity}
    //                 >
    //                     Finish Table
    //                 </Button>
    //                 <Button
    //                     variant="contained"
    //                     onClick={cancelTable}
    //                     disabled={!isCreatingTable}
    //                 >
    //                     Cancel Table
    //                 </Button>
    //             </ButtonGroup>
    //             <ButtonGroup>
    //                 <Button
    //                     variant="contained"
    //                     color='error'
    //                     onClick={isDeletingTables ? confirmTableDeletes : startDeletingTables}
    //                     disabled={isCreatingTable || (isDeletingTables && !tablesToDelete.length)}
    //                 >
    //                     {isDeletingTables ? "Confirm Delete" : "Start Deleting Tables"}
    //                 </Button>
    //                 <Button
    //                     variant="contained"
    //                     onClick={stopDeletingTables}
    //                     disabled={!isDeletingTables}
    //                 >
    //                     Cancel Delete Table
    //                 </Button>
    //             </ButtonGroup>
    //             <Box my={2}>
    //                 <TextField
    //                     label="Guest capacity for this table"
    //                     type="number"
    //                     InputLabelProps={{
    //                         shrink: true,
    //                     }}
    //                     variant="standard"
    //                     value={tableCapacity}
    //                     onChange={(e) => setTableCapacity(e.target.value)}
    //                     disabled={!isCreatingTable}
    //                 />
    //             </Box>
    //             <RestaurantMap
    //                 rows={rows}
    //                 columns={columns}
    //                 cells={cells}
    //                 onCellClick={onCellClick}
    //                 mode={mapMode}
    //             />
    //         </Box>
    //     </TabPanel>
    // );

    return (
        <TabContext value={tab}>
            <Box>
                <TabList onChange={(e, newTab) => setTab(newTab)}>
                    <Tab
                        label="Set Map Dimensions"
                        value="0"
                        disabled={!isCreatingNewTableLayout}
                    />
                    <Tab
                        label="Create Table Layout"
                        value="1"
                        disabled={cells.length !== rows * columns || !isCreatingNewTableLayout}
                    />
                    <Tab
                        label="Edit Table Layout"
                        value="2"
                        disabled={isCreatingNewTableLayout}
                    />
                </TabList>
            </Box>
            <SetDimensionsTabPanel
                rows={rows}
                columns={columns}
                handleChange={handleChange}
                maxRows={MAX_ROWS}
                maxColumns={MAX_COLUMNS}
                onSetDimensions={onSetDimensions}
            />
            <CreateRestaurantMapTabPanel
                mapMode={mapMode}
                rows={rows}
                columns={columns}
                cells={cells}
                onCellClick={onCellClick}
                tableCapacity={tableCapacity}
                setTableCapacity={setTableCapacity}
                isCreatingTable={isCreatingTable}
                startCreatingTable={startCreatingTable}
                cancelTable={cancelTable}
                finishTable={finishTable}
                isDeletingTables={isDeletingTables}
            />
            <EditRestaurantMapTabPanel
                mapMode={mapMode}
                rows={rows}
                columns={columns}
                cells={cells}
                onCellClick={onCellClick}
                tableCapacity={tableCapacity}
                setTableCapacity={setTableCapacity}
                isCreatingTable={isCreatingTable}
                startCreatingTable={startCreatingTable}
                cancelTable={cancelTable}
                finishTable={finishTable}
                tablesToDelete={tablesToDelete}
                isDeletingTables={isDeletingTables}
                startDeletingTables={startDeletingTables}
                stopDeletingTables={stopDeletingTables}
                confirmTableDeletes={confirmTableDeletes}
            />
        </TabContext>
    )
}
