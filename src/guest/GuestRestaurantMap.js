import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'

import Navbar from '../common-components/Navbar'
import RestaurantMap from '../common-components/RestaurantMap'
import Utility from '../utility'
import GuestTableAvailableTimes from './GuestTableAvailableTimes'

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
    currentReservations
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
    currentReservations.forEach((currentReservation) => {
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

    const location = useLocation()
    const [restaurantData, setRestaurantData] = useState(location.state.data)

    const cells = Utility.createCellsArray(
        restaurantData.mapnumofrows,
        restaurantData.mapnumofcols
    )

    // Show available times for clicked table
    const onCellClick = (clickedCell) => (clickObject) => {
        const tableId = clickedCell.tableId
        const tableName = restaurantData.tables.find(
            (table) => table.id === tableId
        ).name

        // TODO: Make get request to back end for reservations at this restaurant at this table
        const reservationsResult = MOCK_RESERVATIONS.filter(
            (reservation) => reservation.tableId === tableId
        )
        const times = createAvailableTimes(
            restaurantData.id,
            tableId,
            tableName,
            restaurantData.openingTime,
            restaurantData.closingTime,
            restaurantData.reservationInterval,
            restaurantData.mininumReservationDuration,
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
                        rows={restaurantData.mapnumofrows}
                        columns={restaurantData.mapnumofcols}
                        tables={restaurantData.tables}
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
