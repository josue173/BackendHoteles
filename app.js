"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const hoteles = express();

const general_routes = require("./src/routes/general.route");
const usuarios_routes = require("./src/routes/usuarios.route");
const adminApp_routes = require("./src/routes/adminApp.route");
const adminHotel_routes = require("./src/routes/adminHotel.route");

hoteles.use(bodyParser.urlencoded({ extended: false }));
hoteles.use(bodyParser.json());

hoteles.use(cors());

hoteles.use(
  "/hoteles",
  general_routes,
  usuarios_routes,
  adminApp_routes,
  adminHotel_routes
);

module.exports = hoteles;
