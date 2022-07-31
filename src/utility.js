export default class Utility {
    static createCellsArray = (rows, columns) =>
        Array.from({ length: rows * columns }).map((e, i) => ({
            tableId: null,
            x: i % columns,
            y: (i - (i % columns)) / columns,
            selected: false,
            isPartOfFinishedTable: false,
            isFirstCellInTable: false
        }))

    static copyTableCellsToCellsArray = (tables, cells) => {
        const newCells = [...cells];
        tables.forEach((table) => {
            let firstCellMarked = false;
            newCells.forEach((cell) => {
                table.cells.forEach((tableCell) => {
                    if (cell.x === tableCell.x && cell.y === tableCell.y) {
                        if (!firstCellMarked) {
                            cell.isFirstCellInTable = true;
                            firstCellMarked = true;
                        }
                        
                        cell.selected = tableCell?.selected
                        cell.isPartOfFinishedTable = tableCell?.isPartOfFinishedTable
                        cell.tableId = table?.id
                    }
                })
            })
        })

        return newCells;
    }

    static minutesToHours = (minutes) => Math.round((minutes * 100) / 60) / 100

    static formatTimeTo12HourString = (date) => {
        // Change hour 0 to 12 midnight if needed
        let hour = date.getHours() % 12
        const period = date.getHours() < 12 ? 'am' : 'pm'
        hour = hour ? hour : 12

        // Add 0 if minute is single digit
        let minute = date.getMinutes()
        if (minute < 10) {
            minute = minute.toString() + '0'
        }

        return `${hour}:${minute}${period}`
    }

    // Return name of months from its number (0-11)
    // Return January by default if out of range
    static monthToMonthName = (monthNumber) => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        if (monthNumber >= 0 && monthNumber <= 11) {
            return months[monthNumber]
        } else {
            return months[0]
        }
    }

    static dayToDayName = (dayNumber) => {
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ]
        if (dayNumber >= 0 && dayNumber <= 6) {
            return days[dayNumber]
        } else {
            return days[0]
        }
    }

    static timeStringToHours = (time) => {
        const hour = parseInt(time.split(':')[0], 10)

        const minuteString = time.split(':')[1];
        const minute = minuteString ? parseInt(time.split(':')[1], 10) : 0;

        return +(hour + Math.round((minute * 100) / 60) / 100);
    }

    static hoursToTimeString = (hours) => {
        hours = parseFloat(hours)
        let hour = Math.floor(hours)
        let minute = Math.round((hours - hour) * 60)
        if (hour.toString().length === 1) {
            hour = '0' + hour.toString()
        }
        if (minute.toString().length === 1) {
            minute = '0' + minute.toString()
        }

        return `${hour}:${minute}`
    }
}
