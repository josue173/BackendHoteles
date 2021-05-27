"use strict";

const express = require("express");
const usuariosController = require("../controllers/usuarios.controller");
const verfication = require("../middlewares/verification");

let hoteles = express.Router();

hoteles.post("/registrarUsuarios", usuariosController.registrarUsuarios);
hoteles.post("/loginUsuarios", usuariosController.loginUsuarios);
hoteles.post(
  "/buscarHabitaciones",
  verfication.ensureAuth,
  usuariosController.buscarHabitaciones
);
hoteles.post(
  "/buscarEventos",
  verfication.ensureAuth,
  usuariosController.buscarEventos
);
hoteles.get(
  "/obtenerUsuarioId/:idUsuario",
  usuariosController.obtenerUsuarioID
);
hoteles.get(
  "/obtenerPerfil/:idUsuario",
  verfication.ensureAuth,
  usuariosController.obtenerPerfil
);
hoteles.put(
  "/editarCuenta/:clienteID",
  verfication.ensureAuth,
  usuariosController.editarCuenta
);

hoteles.delete(
  "/eliminarCuenta/:clienteID",
  verfication.ensureAuth,
  usuariosController.eliminarCuenta
);
hoteles.post(
  "/reservar/:habitacionID",
  verfication.ensureAuth,
  usuariosController.reservar
);

module.exports = hoteles;
