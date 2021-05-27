"use strict";

const express = require("express");
const adminHotelController = require("../controllers/adminHotel.controller");
const verification = require("../middlewares/verification");

let hoteles = express.Router();

hoteles.post(
  "/agregarHabitaciones",
  verification.ensureAuth,
  adminHotelController.agregarHabitaciones
);
hoteles.get(
  "/verEventos",
  verification.ensureAuth,
  adminHotelController.verEventos
);
hoteles.post(
  "/agregarEventos",
  verification.ensureAuth,
  adminHotelController.agregarEventos
);
hoteles.get(
  "/verServicios",
  verification.ensureAuth,
  adminHotelController.verServicios
);
hoteles.post(
  "/agregarServicios",
  verification.ensureAuth,
  adminHotelController.agregarServicios
);
hoteles.get(
  "/habitacionesDisponibles",
  verification.ensureAuth,
  adminHotelController.habitacionesDisponibles
);
hoteles.get(
  "/verReservaciones",
  verification.ensureAuth,
  adminHotelController.verReservaciones
);
hoteles.post(
  "/buscarHospedajes",
  verification.ensureAuth,
  adminHotelController.buscarHospedajes
);
hoteles.get(
  "/verHospedajes",
  verification.ensureAuth,
  adminHotelController.verHospedajes
)

module.exports = hoteles;
