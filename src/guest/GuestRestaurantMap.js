import { useState } from 'react'
import { Box, Container, Typography } from '@mui/material'

import Navbar from '../common-components/Navbar'
import RestaurantMap from '../common-components/RestaurantMap'
import Utility from '../utility'
import GuestTableAvailableTimes from './GuestTableAvailableTimes'
import { useLocation } from 'react-router-dom'
import { getReservationsByRestaurantIdGuest } from '../api/api'

function calculateAvailableTimesRange(
    restaurantId,
    tableId,
    tableName,
    date,
    startTime,
    endTime,
    reservationInterval
) {
    const availableTimesRange = [];
    for (
        let reservationStartTime = startTime;
        reservationStartTime <= endTime;
        reservationStartTime += reservationInterval
    ) {
        const bookingTime = new Date(date);
        const bookingHour = Math.floor(startTime)
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

        availableTimesRange.push(availableTime);
    }

    return availableTimesRange;
}

function createAvailableTimes(
    restaurantId,
    tableId,
    tableName,
    openingTime,
    closingTime,
    reservationInterval,
    mininumReservationDuration,
    existingReservations
) {
    let availableTimes = []
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Open 24 hours
    if (openingTime === closingTime) {
        // Calculate timeslots between openingTime and midnight
        availableTimes.push(
            ...calculateAvailableTimesRange(
                restaurantId,
                tableId,
                tableName,
                today,
                openingTime,
                24,
                reservationInterval
            )
        );

        // Calculate timeslots between midnight and closingTime
        availableTimes.push(
            ...calculateAvailableTimesRange(
                restaurantId,
                tableId,
                tableName,
                tomorrow,
                0,
                closingTime,
                reservationInterval
            )
        );
    } else if (openingTime < closingTime) {
        // Restaurant open during the day
        availableTimes.push(
            ...calculateAvailableTimesRange(
                restaurantId,
                tableId,
                tableName,
                today,
                openingTime,
                closingTime - mininumReservationDuration,
                reservationInterval
            )
        );
    } else if (openingTime > closingTime) {
        // Restaurant open overnight

        // Times between openingTime and midnight
        availableTimes.push(
            ...calculateAvailableTimesRange(
                restaurantId,
                tableId,
                tableName,
                today,
                openingTime,
                24,
                reservationInterval
            )
        );

        // Times between midnight and closingTime
        availableTimes.push(
            ...calculateAvailableTimesRange(
                restaurantId,
                tableId,
                tableName,
                tomorrow,
                0,
                closingTime - mininumReservationDuration,
                reservationInterval
            )
        );
    }

    // Remove available times that conflict with current reservations
    existingReservations.forEach((currentReservation) => {
        const reservationDate = new Date(currentReservation.bookingtime);

        const startTimeHour = reservationDate.getHours()
        const startTimeInHours =
            startTimeHour +
            Utility.minutesToHours(reservationDate.getMinutes())

        const endTimeHour = startTimeHour + (+currentReservation.duration)

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
    });

    // Remove time slots that are before the current time
    availableTimes = availableTimes.filter(a => {
        return a.bookingTime.getTime() > today.getTime();
    });

    return availableTimes;
}

export default function GuestRestaurantMap() {
    const location = useLocation();
    const {
        restaurantid,
        name,
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
    const [selectedTable, setSelectedTable] = useState(null);

    const clearSelectedTable = () => {
        if (selectedTable !== null) {
            cells.forEach((c) => {
                if (c.tableId === selectedTable.id) {
                    c.selected = false;
                }
            });
        }

        setSelectedTable(null);
    };

    const markSelectedTable = (tableId) => {
        // Clear previous table selection
        if (selectedTable !== null && selectedTable.id !== tableId) {
            cells.forEach((c) => {
                if (c.tableId === selectedTable.id) {
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

        setSelectedTable(tables.find(t => t.id === tableId));
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
                        tableCapacity={selectedTable?.capacity}
                        clearSelectedTable={clearSelectedTable}
                    />
                ) : null}
            </Container>
        </>
    )
}
