// @ts-nocheck
let express = require('express')
let path = require('path')
let cors = require('cors')
let Knex = require('knex')
let nodemailer = require('nodemailer')

let app = express()
let port = process.env.PORT || 8080

const createTcpPool = async (config) => {
    if (process.env.NODE_ENV === 'production') {
        console.log('debug: in production')
        return Knex({
            client: 'pg',
            connection: {
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                host: process.env.DB_HOST, // uses internal private IP
                port: process.env.DB_PORT,
            },
            ...config,
        })
    } else {
        return Knex({
            client: 'pg',
            connection: {
                user: 'postgres',
                password: '12345',
                database: 'main-db',
                host: '34.170.246.86', // uses external public IP
            },
            ...config,
        })
    }
}

const createPool = async () => {
    const config = { pool: {} }
    config.pool.max = 5
    config.pool.min = 5
    config.pool.acquireTimeoutMillis = 60000 // 60 seconds
    config.pool.createTimeoutMillis = 30000 // 30 seconds
    config.pool.idleTimeoutMillis = 600000 // 10 minutes
    config.pool.createRetryIntervalMillis = 200 // 0.2 seconds
    return createTcpPool(config)
}

let pool

app.use(async (req, res, next) => {
    if (pool) {
        return next()
    }
    try {
        pool = await createPool()
        next()
    } catch (err) {
        console.error(err)
        return next(err)
    }
})

let staticFilesOptions = {
    dotfiles: 'ignore',
    extensions: ['html', 'htm'],
    index: 'index.html',
}

app.use('/', cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', express.static('./build', staticFilesOptions))

// **************************************** //
// **        OWNER USER MODE APIS        ** //
// **************************************** //

app.post('/api/addOwner', async (req, res) => {
    try {
        let result = await pool
            .insert([
                {
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                },
            ], ['ownerid', 'email'])
            .into('owners')
        console.log('Added new owner', result)
        res.json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.post('/api/owner/login', async (req, res) => {
    try {
        let row = await pool('owners')
            .where('email', req.body.email)
            .select('*')
        if (row.length == 1) {
            let owner = row[0]
            // req.session.usr = owner
            console.log('Logged in user:', owner)
            res.json(owner)
        } else {
            console.error(
                'Owner Login Error: either owner not found or multiple owners are found'
            )
            res.json(null)
        }
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.post('/api/owner/saveRestaurant', async (req, res) => {
    try {
        let result
        if (req.body.data.restaurantId) {
            result = pool('restaurants')
                .where({
                    restaurantid: req.body.data.restaurantId,
                })
                .update({
                    ownerid: req.body.data.ownerId,
                    name: req.body.data.name,
                    address: req.body.data.address,
                    phone: req.body.data.phone,
                    openingtime: req.body.data.openingTime,
                    closingtime: req.body.data.closingTime,
                    minimumreservationduration:
                        req.body.data.minimumReservationDuration,
                    reservationinterval: req.body.data.reservationInterval,
                    mapnumofrows: req.body.data.mapNumOfRows,
                    mapnumofcols: req.body.data.mapNumOfCols,
                    tables: req.body.data.tables,
                    capacity: req.body.data.capacity,
                })
                .catch((err) => console.log(err))
            console.log('Updated existing restraurant', result)
        } else {
            result = await pool
                .insert([
                    {
                        ownerid: req.body.data.ownerId,
                        name: req.body.data.name,
                        address: req.body.data.address,
                        phone: req.body.data.phone,
                        openingtime: req.body.data.openingTime,
                        closingtime: req.body.data.closingTime,
                        minimumreservationduration:
                            req.body.data.minimumReservationDuration,
                        reservationinterval: req.body.data.reservationInterval,
                        mapnumofrows: req.body.data.mapNumOfRows,
                        mapnumofcols: req.body.data.mapNumOfCols,
                        tables: req.body.data.tables,
                        capacity: req.body.data.capacity,
                    },
                ])
                .returning(['restaurantid', 'tables'])
                .into('restaurants')

            const restaurantId = result[0].restaurantid
            const tables = result[0].tables

            console.log('type', typeof req.body.data.tables)
            console.log('restaurantId', restaurantId)
            console.log('tables before', tables)

            // Update tables with restaurantId from newly inserted restaurant
            tables.forEach((t) => (t.restaurantId = restaurantId))

            console.log('updatedTables', tables)
            await pool('restaurants')
                .where({
                    restaurantid: req.body.data.restaurantId,
                })
                .update({
                    tables: JSON.stringify(tables),
                })
                .catch((err) => console.log(err))

            console.log('Added new restaurant')
        }
        res.json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.get('/api/owner/getAllRestaurants', async (req, res) => {
    try {
        let restaurantsArray = await pool('restaurants')
            .where('ownerid', req.query.ownerId)
            .select('*')
        res.json(restaurantsArray)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.delete('/api/owner/deleteRestaurant', async (req, res) => {
    try {
        let result = await pool('restaurants')
            .where('restaurantid', req.body.restaurantId)
            .delete()
        console.log('Deleted restaurant', result)
        res.json(result)
    } catch (e) {
        console.error(e)
        res.json(e)
    }
})

app.get('/api/owner/getReservationsByRestaurantId', async (req, res) => {
    try {
        let restaurantsArray = await pool('reservations')
            .where('restaurantid', req.query.restaurantId)
            .select('*')
        res.json(restaurantsArray)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

// **************************************** //
// **        GUEST USER MODE APIS        ** //
// **************************************** //

app.post('/api/addGuest', async (req, res) => {
    try {
        let result = await pool
            .insert([
                {
                    fname: req.body.fname,
                    lname: req.body.lname,
                    phone: req.body.phone,
                    email: req.body.email,
                },
            ], ['guestid', 'email'])
            .into('guests')
        console.log('Added new guest', result)
        res.json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.post('/api/guest/login', async (req, res) => {
    try {
        let row = await pool('guests')
            .where('email', req.body.email)
            .select('*')
        if (row.length == 1) {
            let guest = row[0]
            // req.session.usr = guest
            console.log('Logged in user:', guest)
            res.json(guest)
        } else {
            console.error(
                'Guest Login Error: either guest not found or multiple guests are found'
            )
            res.json(null)
        }
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.get('/api/guest/getAllRestaurants', async (req, res) => {
    try {
        // console.log('cookies', req.session.usr)
        let restaurantsArray = await pool('restaurants').select('*')
        res.json(restaurantsArray)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.get('/api/guest/getReservationsByRestaurantId', async (req, res) => {
    try {
        let row = await pool('reservations')
            .where({
                restaurantid: req.query.restaurantId,
                tableid: req.query.tableId,
            })
            .select('*')
        res.json(row)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.post('/api/guest/addReservation', async (req, res) => {
    try {
        let result = await pool
            .insert([
                {
                    guestid: req.body.data.guestId,
                    tableid: req.body.data.tableId,
                    restaurantid: req.body.data.restaurantId,
                    bookingtime: req.body.data.bookingTime,
                    duration: req.body.data.duration,
                    note: req.body.data.note,
                },
            ])
            .into('reservations')
        console.log('Added new reservation', result)
        res.json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.delete('/api/guest/deleteReservation', async (req, res) => {
    try {
        let result = await pool('reservations')
            .where('reservationid', req.body.reservationId)
            .delete()
        console.log('Deleted reservation', result)
        res.json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.get('/api/guest/getReservationsWithRestaurantsData', async (req, res) => {
    try {
        let reservations = await pool('reservations')
            .where({
                guestid: req.query.guestId,
            })
            .select('*')
        let promisesArray = []
        reservations.forEach(async (reservation) => {
            let restaurantPromise = pool('restaurants')
                .where('restaurantid', reservation.restaurantid)
                .select('*')
            promisesArray.push(restaurantPromise)
        })
        let restaurants = await Promise.all(promisesArray)
        restaurants.forEach((restaurant, index) => {
            restaurant[0].bookingtime = reservations[index].bookingtime
            restaurant[0].reservationid = reservations[index].reservationid
            restaurant[0].note = reservations[index].note
        })
        res.json(restaurants.flat(1))
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

app.get('/api/guest/profile', async (req, res) => {
    try {
        const result = await pool('guests')
            .where('guestid', req.query.guestId)
            .select('*');

        res.json(result[0]);

    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
})

// Save guest profile
app.put('/api/guest/profile', async (req, res) => {
    try {
        const {
            guestid,
            fname, 
            lname,
            phone,
            email
        } = req.body.data;

        const result = await pool('guests')
            .where('guestid', guestid)
            .update({
                fname,
                lname,
                phone,
                email
            })
            .returning([
                'fname',
                'lname',
                'phone',
                'email'
            ]);

        console.log('Updated guest profile', result[0]);

        res.json(result[0]);

    } catch (e) {
        console.error(e);
        res.status(500).json();
    }
});

app.post('/api/guest/sendEmailConfirmation', async (req, res) => {
    try {
        console.log(req.body)
        // e-mail message options
        let mailOptions = {
            from: 'easybook2022@hotmail.com',
            to: req.body.email,
            subject: 'Your booking is confirmed!',
            text: req.body.emailText,
        }

        // e-mail transport configuration
        let transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'easybook2022@hotmail.com',
                pass: 'easybook12345',
            },
        })

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
        res.json({})
    } catch (e) {
        console.error(e)
        res.status(500).json()
    }
})

// send static files for every route
app.get('*', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, './build') })
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})
