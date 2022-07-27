import axios from "axios";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://cmpt-372-project.uc.r.appspot.com"
    : "http://localhost:8080";

export const addGuest = (data) => {
  return axios.post(`${apiUrl}/api/addGuest`, {
    fname: data.get("firstname"),
    lname: data.get("lastname"),
    phone: data.get("phone"),
    email: data.get("email"),
  });
};

export const addOwner = (data) => {
  return axios.post(`${apiUrl}/api/addOwner`, {
    fname: data.get("firstname"),
    lname: data.get("lastname"),
    email: data.get("email"),
  });
};

export const loginGuest = (email) => {
  return axios.post(`${apiUrl}/api/guest/login`, {
    email: email,
  });
};

export const loginOwner = (email) => {
  return axios.post(`${apiUrl}/api/owner/login`, {
    email: email,
  });
};

export const saveRestaurantOwner = (data) => {
  return axios.post(`${apiUrl}/api/owner/saveRestaurant`, {
    data: data,
  });
};

export const getAllRestaurantsOwner = () => {
  // todo: get userId at the backend instead of from sessionStorage
  let ownerId = sessionStorage.getItem("userId");
  return axios.get(`${apiUrl}/api/owner/getAllRestaurants`, {
    params: {
      ownerId: ownerId,
    },
  });
};

export const deleteRestaurantOwner = (restaurantId) => {
  return axios.delete(`${apiUrl}/api/owner/deleteRestaurant`, {
    data: {
      restaurantId: restaurantId,
    },
  });
};

export const getGuestProfile = () => {
  return axios.get(`${apiUrl}/api/guest/profile`);
};

export const getAllRestaurantsGuest = () => {
  return axios.get(`${apiUrl}/api/guest/main`);
};

export const getCurrentBookingsGuest = () => {
  return axios.get(`${apiUrl}/api/guest/currentBookings`);
};
