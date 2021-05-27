"use strict";

const mongoose = require("mongoose");
const hoteles = require("./app");
const Usuarios = require("./src/models/usuarios.model");
const bcrypt = require("bcrypt-nodejs");
var usuariosModel = new Usuarios();

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/gestionhoteles", {
    useFindAndModify: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Conexion exitosa a la base de datos");
    hoteles.listen(3000, function () {
      usuariosModel.usuario = "ADMIN";
      usuariosModel.rol = "AdministradorApp";
      Usuarios.find({ $or: [{ usuario: usuariosModel.usuario }] }).exec(
        (err, usuarioEncontrado) => {
          if (err) console.log("Error interno");
          if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
            console.log("El administrador ya existe");
          } else {
            bcrypt.hash("123", null, null, (err, encpitacion) => {
              usuariosModel.contrasena = encpitacion;
              usuariosModel.save((err, adminRegistrado) => {
                if (err) console.log("Error interno");
                if (adminRegistrado) {
                  console.log(adminRegistrado);
                } else {
                  console.log("Error en la peticion de registro");
                }
              });
            });
          }
        }
      );
      console.log("El servidor esta funcionando en el puerto 3000");
    });
  })
  .catch((err) => console.log(err));
