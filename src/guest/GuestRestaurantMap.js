import { useState } from 'react'
import { Box, Container, Typography } from '@mui/material'

import Navbar from '../common-components/Navbar'
import RestaurantMap from '../common-components/RestaurantMap'
import Utility from '../utility'
import GuestTableAvailableTimes from './GuestTableAvailableTimes'
import { useLocation } from 'react-router-dom'
import { getReservationsByRestaurantIdGuest } from '../api/api'

const MOCK_RESTAURANT_MAP = {
    // capacity: 50,
    restaurantId: 1,
    openingTime: 12,
    closingTime: 22,
    mininumReservationDuration: 1.5,
    reservationInterval: 0.5,
    rows: 10,
    columns: 10,
    tables: [
        {
            id: 1,
            restaurantId: 1,
            name: 'Table 1',
            capacity: 3,
            cells: [
                {
                    tableId: 1,
                    x: 0,
                    y: 0,
                    selected: true,
                    isPartOfTable: true,
                },
                {
                    tableId: 1,
                    x: 1,
                    y: 0,
                    selected: true,
                    isPartOfTable: true,
                },
                {
                    tableId: 1,
                    x: 2,
                    y: 0,
                    selected: true,
                    isPartOfTable: true,
                },
            ],
        },
        {
            id: 2,
            restaurantId: 1,
            name: 'Table 2',
            capacity: 6,
            cells: [
                {
                    tableId: 2,
                    x: 7,
                    y: 9,
                    selected: true,
                    isPartOfTable: true,
                },
                {
                    tableId: 2,
                    x: 8,
                    y: 9,
                    selected: true,
                    isPartOfTable: true,
                },
                {
                    tableId: 2,
                    x: 9,
                    y: 9,
                    selected: true,
                    isPartOfTable: true,
                },
            ],
        },
    ],
}

const MOCK_RESERVATIONS = [
    {
        id: 1,
        restaurantId: 1,
        userId: 1,
        tableId: 1,
        bookingTime: new Date('July 14, 2022 12:00:00'),
        duration: 2,
    },
    {
        id: 1,
        restaurantId: 1,
        userId: 1,
        tableId: 1,
        bookingTime: new Date('July 14, 2022 18:30:00'),
        duration: 2,
    },
]

function createAvailableTimes(
    restaurantId,
    tableId,
    tableName,
    openingTime,
    closingTime,
    reservationInterval,
    mininumReservationDuration,
    getReservationsWithRestaurantsData
) {
    const latestReservationTime = closingTime - mininumReservationDuration
    let availableTimes = []
    for (
        let reservationStartTime = openingTime;
        reservationStartTime <= latestReservationTime;
        reservationStartTime += reservationInterval
    ) {
        const bookingTime = new Date()
        const bookingHour = Math.floor(openingTime)
        const bookingMinute = Math.floor(
            (reservationStartTime - bookingHour) * 60
        )
        bookingTime.setHours(bookingHour)
        bookingTime.setMinutes(bookingMinute)

        const availableTime = {
            restaurantId,
            tableId,
            tableName,
            bookingTime,
        }

        availableTimes.push(availableTime)
    }

    // Remove available times that conflict with current reservations
    getReservationsWithRestaurantsData.forEach((currentReservation) => {
        const reservationDate = new Date(currentReservation.bookingtime);

        const startTimeHour = reservationDate.getHours()
        const startTimeInHours =
            startTimeHour +
            Utility.minutesToHours(reservationDate.getMinutes())

        const endTimeHour = startTimeHour + currentReservation.duration
        const endTimeMinutesInHours = endTimeHour - Math.floor(endTimeHour)
        const endTimeInHours = endTimeHour + endTimeMinutesInHours

        availableTimes = availableTimes.filter((a) => {
            const time = a.bookingTime
            const timeInHours =
                time.getHours() + Utility.minutesToHours(time.getMinutes())
            return (
                timeInHours < startTimeInHours || endTimeInHours <= timeInHours
            )
        })
    })

    return availableTimes
}

export default function GuestRestaurantMap() {
    const location = useLocation();
    const {
        restaurantid,
        ownerid,
        name,
        address,
        phone,
        capacity,
        openingtime,
        closingtime,
        mapnumofrows,
        mapnumofcols,
        minimumreservationduration,
        reservationinterval,
        tables
    } = location.state;

    const [availableTimes, setAvailableTimes] = useState([])
    const [cells, setCells] = useState(
        Utility.copyTableCellsToCellsArray(
            tables, 
            Utility.createCellsArray(
                mapnumofrows,
                mapnumofcols
            )
        )
    );
    const [selectedTableId, setSelectedTableId] = useState(null);

    const clearSelectedTable = () => {
        if (selectedTableId !== null) {
            cells.forEach((c) => {
                if (c.tableId === selectedTableId) {
                    c.selected = false;
                }
            });
        }

        setSelectedTableId(null);
    };

    const markSelectedTable = (tableId) => {
        // Clear previous table selection
        if (selectedTableId !== null && selectedTableId !== tableId) {
            cells.forEach((c) => {
                if (c.tableId === selectedTableId) {
                    c.selected = false;
                }
            });
        }

        // Mark newly selected table
        cells.forEach((c) => {
            if (c.tableId === tableId) {
                c.selected = true;
            }
        });

        setSelectedTableId(tableId);
        setCells([...cells])
    }

    // Show available times for clicked table
    const onCellClick = (clickedCell) => (clickObject) => {
        if (clickedCell.tableId !== null) {
            const tableId = clickedCell.tableId

            markSelectedTable(tableId);

            const tableName = tables.find(
                (table) => table.id === tableId
            ).name
            
            // Get current reservations at the clicked table and calculate available times
            getReservationsByRestaurantIdGuest(restaurantid, tableId)
                .then(response => {
                    const times = createAvailableTimes(
                        restaurantid,
                        tableId,
                        tableName,
                        +openingtime,
                        +closingtime,
                        +reservationinterval,
                        +minimumreservationduration,
                        response.data
                    );
            
                    setAvailableTimes(times);
                });
        }
    }

    return (
        <>
            <Navbar isGuestMode={true} />
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxHeight: '80vh',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flex: '1 1 0',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h3">{name}</Typography>
                    <Typography variant="h5">
                        Select a table and time
                    </Typography>
                    <RestaurantMap
                        rows={mapnumofrows}
                        columns={mapnumofcols}
                        cells={cells}
                        onCellClick={onCellClick}
                        mode='guestView'
                    />
                </Box>
                {availableTimes.length ? (
                    <GuestTableAvailableTimes
                        restaurantId={restaurantid}
                        availableTimes={availableTimes}
                        minimumReservationDuration={+minimumreservationduration}
                        clearSelectedTable={clearSelectedTable}
                    />
                ) : null}
            </Container>
        </>
    )
}
