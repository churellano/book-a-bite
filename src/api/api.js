import axios from "axios";

export const addGuest = (data) => {
  return axios.post(`http://localhost:8080/api/addGuest`, {
    fname: data.get("firstname"),
    lname: data.get("lastname"),
    phone: data.get("phone"),
    email: data.get("email"),
  });
};

export const addOwner = (data) => {
  return axios.post(`http://localhost:8080/api/addOwner`, {
    fname: data.get("firstname"),
    lname: data.get("lastname"),
    email: data.get("email"),
  });
};

export const loginGuest = (email) => {
  return axios.post(`http://localhost:8080/api/guest/login`, {
    email: email,
  });
};

export const loginOwner = (email) => {
  return axios.post(`http://localhost:8080/api/owner/login`, {
    email: email,
  });
};
