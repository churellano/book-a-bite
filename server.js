var express = require("express");
var path = require("path");
var cors = require("cors");
let restaurants = require('./testRestaurants')
let guests = require('./testGuests')

var app = express();
var port = process.env.PORT || 8080;
// const { Pool } = require('pg');
// var pool = new Pool({
//   connectionString: 'postgres://postgres:root@localhost/users'
// })

var options = {
  dotfiles: "ignore",
  extensions: ["html", "htm"],
  index: "index.html",
};
app.use("/", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./build", options));

app.get("/api/guest/main", (req, res) => {
  res.json(restaurants);
});

app.get("/api/guest/currentBookings", (req, res) => {
    res.json(restaurants);
});

app.get("/api/guest/profile", (req, res) => {
    res.json(guests[0]);
});

app.get("/api/owner/main", (req, res) => {
    res.json(restaurants);
});

// send static files for every route
app.get("*", function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "./build") });
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
