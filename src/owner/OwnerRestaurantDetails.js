import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Container } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import Navbar from '../common-components/Navbar'
import OwnerRestaurantProfile from './OwnerRestaurantProfile'
import OwnerRestaurantMap from './OwnerRestaurantMap'
import Utility from '../utility'
import { saveRestaurantOwner } from '../api/api'

const DEFAULT_ROWS = 10
const DEFAULT_COLUMNS = 10

export default function OwnerRestaurantDetails() {
    const location = useLocation()

    const [tab, setTab] = useState('0')
    const [name, setName] = useState(
        location.state ? location.state.data.name : ''
    )
    const [address, setAddress] = useState(
        location.state ? location.state.data.address : ''
    )
    const [isAddrSelected, setIsAddrSelected] = useState(
        location.state ? true : false
    )

    const [phone, setPhone] = useState(
        location.state ? location.state.data.phone : ''
    )
    const [capacity, setCapacity] = useState(
        location.state ? location.state.data.capacity : 0
    )
    const [openingTime, setOpeningTime] = useState(
        location.state
            ? Utility.hoursToTimeString(location.state.data.openingtime)
            : '00:00'
    )
    const [closingTime, setClosingTime] = useState(
        location.state
            ? Utility.hoursToTimeString(location.state.data.closingtime)
            : '00:00'
    )
    const [minimumReservationDuration, setMinimumReservationDuration] =
        useState(
            location.state
                ? Math.round(
                    location.state.data.minimumreservationduration * 60
                )
                : 60
        )
    const [reservationInterval, setReservationInterval] = useState(
        location.state
            ? Math.round(location.state.data.reservationinterval * 60)
            : 30
    )
    const [rows, setRows] = useState(
        location.state ?
            location.state.data.mapnumofrows :
            DEFAULT_ROWS
    )
    const [columns, setColumns] = useState(
        location.state ?
            location.state.data.mapnumofcols :
            DEFAULT_COLUMNS)
    const [tables, setTables] = useState(
        location.state ? location.state.data.tables : []
    )
    const [tableCapacity, setTableCapacity] = useState(0)

    const [isCreatingNewTableLayout, setIsCreatingNewTableLayout] = useState(
        location.state && location.state.data.restaurantid ?
            false :
            true
    );

    const navigate = useNavigate()

    const ownerRestaurantProfileProps = {
        name,
        address,
        isAddrSelected,
        phone,
        capacity,
        openingTime,
        closingTime,
        minimumReservationDuration: +minimumReservationDuration,
        reservationInterval: +reservationInterval,
        setName,
        setAddress,
        setIsAddrSelected,
        setPhone,
        setCapacity,
        setOpeningTime,
        setClosingTime,
        setMinimumReservationDuration,
        setReservationInterval,
    }

    const ownerRestaurantMapProps = {
        restaurantId: location.state ? location.state.data.restaurantid : null,
        rows,
        columns,
        tables,
        tableCapacity,
        isCreatingNewTableLayout,
        setRows,
        setColumns,
        setTables,
        setTableCapacity,
        setIsCreatingNewTableLayout
    }

    const saveRestaurantDetails = async () => {
        try {
            const restaurant = {
                restaurantId: location.state
                    ? location.state.data.restaurantid
                    : null,
                ownerId: +sessionStorage.getItem('userId'),
                name,
                address,
                isAddrSelected,
                phone,
                capacity,
                openingTime: Utility.timeStringToHours(openingTime),
                closingTime: Utility.timeStringToHours(closingTime),
                minimumReservationDuration: Utility.minutesToHours(
                    minimumReservationDuration
                ),
                reservationInterval:
                    Utility.minutesToHours(reservationInterval),
                mapNumOfRows: rows,
                mapNumOfCols: columns,
                tables: JSON.stringify(tables),
            }
            if (!isAddrSelected) {
                alert("Please select a valid address/location for of your Restaurant")
                throw Error("No valid Address Selected by Autocomplete");
            }

            await saveRestaurantOwner(restaurant)

            navigate('/owner/main')
        } catch (error) {
            console.error('Failed to create restaurant', error)
        }
    }

    const resetRestaurantMap = () => {
        setIsCreatingNewTableLayout(true);
    }

    const cancelResetRestaurantMap = () => {
        setIsCreatingNewTableLayout(false);

        // Workaround to ensure fields are restored to previous state modified before cancellation
        window.location.reload();
    }

    return (
        <div>
            <Navbar isGuestMode={false} />
            <Container>
                <TabContext value={tab}>
                    <Box sx={{
                        '& > .MuiButton-root': {
                            mr: 1
                        }
                    }}>
                        <Button
                            variant="contained"
                            onClick={() => saveRestaurantDetails()}
                            color="success"
                        >
                            Save Restaurant
                        </Button>
                        {tab === '1' ? 
                            <Button
                                variant="outlined"
                                color={
                                isCreatingNewTableLayout ?
                                    'error' :
                                    'primary'
                                }
                                onClick={
                                isCreatingNewTableLayout ?
                                    cancelResetRestaurantMap :
                                    resetRestaurantMap
                                }
                            >
                            {
                                isCreatingNewTableLayout ?
                                    'Cancel New Restaurant Map' :
                                    'Create New Restaurant Map'
                            }
                            </Button> : null
                        }
                        <TabList onChange={(e, newTab) => setTab(newTab)}>
                            <Tab label="Restaurant information" value="0" />
                            <Tab label="Restaurant map" value="1" />
                        </TabList>
                    </Box>
                    <TabPanel value="0">
                        <OwnerRestaurantProfile
                            {...ownerRestaurantProfileProps}
                        />
                    </TabPanel>
                    <TabPanel value="1">
                        <OwnerRestaurantMap {...ownerRestaurantMapProps} />
                    </TabPanel>
                </TabContext>
            </Container>
            `
        </div>
    )
}
