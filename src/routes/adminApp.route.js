"use strict";

const express = require("express");
const adminAppController = require("../controllers/adminApp.controller");
const verification = require("../middlewares/verification");

let hoteles = express.Router();

hoteles.get(
  "/verUsuarios",
  verification.ensureAuth,
  adminAppController.verUsuarios
);
hoteles.post(
  "/agregarAdminHotel",
  verification.ensureAuth,
  adminAppController.agregarAdminHotel
);
hoteles.post(
  "/agregarHotel/:administradorID",
  verification.ensureAuth,
  adminAppController.agregarHotel
);
hoteles.get(
  "/verHotelesAdmin",
  verification.ensureAuth,
  adminAppController.verHotelesAdmin
);
hoteles.delete(
  "/eliminarUsuarios/:usuarioID",
  verification.ensureAuth,
  adminAppController.eliminarUsuario
);
hoteles.put(
  "/editarUsuarios/:usuarioID",
  verification.ensureAuth,
  adminAppController.editarUsuarios
);
hoteles.put(
  "/editarHotel/:hotelID",
  verification.ensureAuth,
  adminAppController.editarHotel
);
hoteles.delete(
  "/eliminarHotel/:hotelID",
  verification.ensureAuth,
  adminAppController.eliminarHotel
);


module.exports = hoteles;
