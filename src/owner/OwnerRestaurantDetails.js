import { Box, Button, Container } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../common-components/Navbar'
import OwnerRestaurantProfile from './OwnerRestaurantProfile'
import OwnerRestaurantMap from './OwnerRestaurantMap'
import Utility from '../utility'
import { addRestaurantOwner } from '../api/api'

const DEFAULT_ROWS = 10
const DEFAULT_COLUMNS = 10

export default function OwnerRestaurantDetails() {
    const [tab, setTab] = useState('0')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [capacity, setCapacity] = useState(0)
    const [openingTime, setOpeningTime] = useState('00:00')
    const [closingTime, setClosingTime] = useState('00:00')
    const [mininumReservationDuration, setMininumReservationDuration] =
        useState(60)
    const [reservationInterval, setReservationInterval] = useState(30)

    const [rows, setRows] = useState(DEFAULT_ROWS)
    const [columns, setColumns] = useState(DEFAULT_COLUMNS)
    const [tables, setTables] = useState([])
    const [tableCapacity, setTableCapacity] = useState(0)

    const navigate = useNavigate()

    const ownerRestaurantProfileProps = {
        name,
        address,
        phone,
        capacity,
        openingTime,
        closingTime,
        mininumReservationDuration,
        reservationInterval,
        setName,
        setAddress,
        setPhone,
        setCapacity,
        setOpeningTime,
        setClosingTime,
        setMininumReservationDuration,
        setReservationInterval,
    }

    const ownerRestaurantMapProps = {
        rows,
        columns,
        tables,
        tableCapacity,
        setRows,
        setColumns,
        setTables,
        setTableCapacity,
    }

    const saveRestaurantDetails = async () => {
        try {
            const restaurant = {
                ownerId: sessionStorage.getItem('userId'),
                name,
                address,
                phone,
                capacity,
                openingTime: Utility.timeStringToHours(openingTime),
                closingTime: Utility.timeStringToHours(closingTime),
                mininumReservationDuration: Utility.minutesToHours(
                    mininumReservationDuration
                ),
                reservationInterval:
                    Utility.minutesToHours(reservationInterval),
                mapNumOfRows: rows,
                mapNumOfCols: columns,
                tables: JSON.stringify(tables),
            }

            console.log('Saving restaurant: ', restaurant)

            const result = await addRestaurantOwner(restaurant)

            console.log('saveRestaurantDetails result: ', result)
            navigate('/owner/main')
        } catch (error) {
            console.error('Error: Failed to create restaurant')
        }
    }

    return (
        <div>
            <Navbar isGuestMode={false} />
            <Container>
                <TabContext value={tab}>
                    <Box>
                        <Button
                            variant="contained"
                            onClick={() => saveRestaurantDetails()}
                        >
                            Create Restaurant
                        </Button>
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
