"use strict";

const express = require("express");
const generalController = require("../controllers/general.controller");

let hoteles = express.Router();

hoteles.get("/verHoteles", generalController.verHoteles);
hoteles.post("/buscarHotel", generalController.buscarHotel);
hoteles.get("/verHotel/:hotelID", generalController.verHotel);
hoteles.get(
  "/verHabitaciones/:hotelHabitacionID",
  generalController.verHabitaciones
);
hoteles.get("/verHabitacion/:habitacionID", generalController.verHabitacion);
hoteles.get("/verServicios/:hoteServiciolID", generalController.verServicios);

module.exports = hoteles;
