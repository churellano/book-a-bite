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
        const startTimeHour = currentReservation.bookingTime.getHours()
        const startTimeInHours =
            startTimeHour +
            Utility.minutesToHours(currentReservation.bookingTime.getMinutes())

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
    const [availableTimes, setAvailableTimes] = useState([])
    // TODO: replace MOCK_RESTAURANT_MAP by restaurantData
    // this gets all info about the selected data
    // const [restaurantData, setRestaurantData] = useState(useLocation().state)

    const cells = Utility.createCellsArray(
        MOCK_RESTAURANT_MAP.rows,
        MOCK_RESTAURANT_MAP.columns
    )

    // Show available times for clicked table
    const onCellClick = (clickedCell) => (clickObject) => {
        const tableId = clickedCell.tableId
        const tableName = MOCK_RESTAURANT_MAP.tables.find(
            (table) => table.id === tableId
        ).name

        // TODO: Make get request to back end for reservations at this restaurant at this table
        // const reservationsResult = getReservationsByRestaurantIdGuest(
        //     restaurantData.restaurantid,
        //     tableId
        // )
        const reservationsResult = MOCK_RESERVATIONS.filter(
            (reservation) => reservation.tableId === tableId
        )
        const times = createAvailableTimes(
            MOCK_RESTAURANT_MAP.id,
            tableId,
            tableName,
            MOCK_RESTAURANT_MAP.openingTime,
            MOCK_RESTAURANT_MAP.closingTime,
            MOCK_RESTAURANT_MAP.reservationInterval,
            MOCK_RESTAURANT_MAP.mininumReservationDuration,
            reservationsResult
        )

        setAvailableTimes(times)
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
                    <Typography variant="h3">Restaurant Name</Typography>
                    <Typography variant="h5">
                        Select a table and time
                    </Typography>
                    <RestaurantMap
                        rows={MOCK_RESTAURANT_MAP.rows}
                        columns={MOCK_RESTAURANT_MAP.columns}
                        tables={MOCK_RESTAURANT_MAP.tables}
                        cells={cells}
                        onCellClick={onCellClick}
                        isGuestMode={true}
                    />
                </Box>
                {availableTimes.length ? (
                    <GuestTableAvailableTimes availableTimes={availableTimes} />
                ) : null}
            </Container>
        </>
    )
}
