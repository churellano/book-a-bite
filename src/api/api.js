import axios from 'axios'

const apiUrl =
    process.env.NODE_ENV === 'production'
        ? 'https://cmpt-372-project.uc.r.appspot.com'
        : 'http://localhost:8080'

export const addGuest = (data) => {
    return axios.post(`${apiUrl}/api/addGuest`, {
        fname: data.get('firstname'),
        lname: data.get('lastname'),
        phone: data.get('phone'),
        email: data.get('email'),
    })
}

export const addOwner = (data) => {
    return axios.post(`${apiUrl}/api/addOwner`, {
        fname: data.get('firstname'),
        lname: data.get('lastname'),
        email: data.get('email'),
    })
}

export const loginGuest = (email) => {
    return axios.post(`${apiUrl}/api/guest/login`, {
        email: email,
    })
}

export const loginOwner = (email) => {
    return axios.post(`${apiUrl}/api/owner/login`, {
        email: email,
    })
}

export const saveRestaurantOwner = (data) => {
    return axios.post(`${apiUrl}/api/owner/saveRestaurant`, {
        data: data,
    })
}

export const getAllRestaurantsOwner = () => {
    // todo: get userId at the backend instead of from sessionStorage
    let ownerId = sessionStorage.getItem('userId')
    return axios.get(`${apiUrl}/api/owner/getAllRestaurants`, {
        params: {
            ownerId: ownerId,
        },
    })
}

export const deleteRestaurantOwner = (restaurantId) => {
    return axios.delete(`${apiUrl}/api/owner/deleteRestaurant`, {
        data: {
            restaurantId: restaurantId,
        },
    })
}

export const getReservationsByRestaurantIdOwner = (restaurantId) => {
    return axios.get(`${apiUrl}/api/owner/getReservationsByRestaurantId`, {
        params: {
            restaurantId: restaurantId,
        },
    })
}

export const getProfileGuest = (guestid) => {
    return axios.get(`${apiUrl}/api/guest/profile`, {
        params: {
            guestId: guestid
        }
    })
}

export const saveProfileGuest = (profile) => {
    return axios.put(`${apiUrl}/api/guest/profile`, {
        data: profile
    })
}

export const getAllRestaurantsGuest = () => {
    return axios.get(`${apiUrl}/api/guest/getAllRestaurants`)
}

export const addReservationGuest = (data) => {
    return axios.post(`${apiUrl}/api/guest/addReservation`, {
        data: data,
    })
}

export const getReservationsByRestaurantIdGuest = (restaurantId, tableId) => {
    return axios.get(`${apiUrl}/api/guest/getReservationsByRestaurantId`, {
        params: {
            restaurantId: restaurantId,
            tableId: tableId,
        },
    })
}

export const getCurrentReservationsGuest = (guestId) => {
    return axios.get(`${apiUrl}/api/guest/getReservationsWithRestaurantsData`, {
        params: {
            guestId: guestId,
        },
    })
}

export const deleteReservation = (reservationId) => {
    return axios.delete(`${apiUrl}/api/guest/deleteReservation`, {
        data: {
            reservationId: reservationId,
        },
    })
}

export const sendEmailConfirmation = (email, emailText) => {
    return axios.post(`${apiUrl}/api/guest/sendEmailConfirmation`, {
        email: email,
        emailText: emailText,
    })
}
