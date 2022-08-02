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

    static minutesToHours = (minutes) => Math.round((minutes * 100) / 60) / 100;

    static hoursToMinutes = (hours) => Math.round(hours * 60);

    static amOrPm = (timeInHours) => timeInHours >= 12 ? 'p.m.' : 'a.m.';

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

    static isRestaurantOpen = (openingTime, closingTime) => {
        const currentDate =  new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentTime = currentHour + Utility.minutesToHours(currentMinute);
    
        const openingHour = Math.floor(openingTime);
        const openingMinute = Utility.hoursToMinutes(openingTime - openingHour);
    
        const closingHour = Math.floor(closingTime);
        const closingMinute = Utility.hoursToMinutes(closingTime - closingHour);
    
        const openingDate = new Date();
        openingDate.setHours(openingHour);
        openingDate.setMinutes(openingMinute);
    
        const closingDate = new Date();
        closingDate.setHours(closingHour);
        closingDate.setMinutes(closingMinute);
    
        if (openingTime === closingTime) {
            return true;
        }
    
        // Restaurant is open in the day
        if (openingTime < closingTime) {
            if (currentTime < openingTime) {
                return false;
            } else if (currentTime > openingTime && currentTime < closingTime) {
                return true;
            } else if (currentTime > closingTime) {
                return false;
            }
        }
    
        // Restaurant is open in the night
        if (openingTime > closingTime) {
            if (currentTime < openingTime) {
                return false;
            } else if (currentTime > openingTime) {
                return true;
            } else if (currentTime < closingTime) {
                return true;
            } else if (currentTime > closingTime && currentTime < openingTime) {
                return false;
            }
        }
    }

    static minutesToMinutesString = (minutes) => minutes < 10 ? minutes.toString() + '0' : minutes.toString();

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
    
    static isEmailValid = (email) => {
        const emailRegex = new RegExp(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        );

        return emailRegex.test(email);
    }

    // 0000000000 or 000-000-0000 is valid
    static isPhoneValid = (phone) => {
        const phoneRegex = new RegExp(/[0-9]{3}(-)?[0-9]{3}(-)?[0-9]{4}/);
        return phoneRegex.test(phone);
    }
}
