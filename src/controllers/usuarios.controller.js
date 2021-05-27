"use strict";

const jwt = require("../services/jwt");
const bcrypt = require("bcrypt-nodejs");

const Usuarios = require("../models/usuarios.model");
const Hoteles = require("../models/hoteles.model");
const Habitaciones = require("../models/habitaciones.model");
const Eventos = require("../models/eventos.model");
const Reservaciones = require("../models/reservaciones.model");
const Servicios = require("../models/servicios.model");

function registrarUsuarios(req, res) {
  let params = req.body;
  let usuariosModel = new Usuarios();
  if (params.usuario && params.email && params.contrasena) {
    usuariosModel.usuario = params.usuario;
    usuariosModel.email = params.email;
    usuariosModel.contrasena = params.contrasena;
    usuariosModel.hotelHospedado = null;
    usuariosModel.estado = "No hospedado";
    usuariosModel.rol = "cliente";
    Usuarios.find({
      $and: [
        { email: usuariosModel.email },
        { usuario: usuariosModel.usuario },
      ],
    }).exec((err, usuarioEncontrado) => {
      if (err)
        return res.status(500).send({ mensaje: "Error interno al comparar" });
      if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
        return res.status(500).send({ mensaje: "El usuario ya existe" });
      } else {
        bcrypt.hash(params.contrasena, null, null, (err, encriptada) => {
          usuariosModel.contrasena = encriptada;
          usuariosModel.save((err, usuarioRegistrado) => {
            if (usuarioRegistrado) {
              return res.status(200).send({ usuarioRegistrado });
            } else {
              return res
                .status(500)
                .send({ mensaje: "Error interno al registar" });
            }
          });
        });
      }
    });
  } else {
    return res
      .status(500)
      .send({ mensaje: "Llene todos los campos del registro" });
  }
}

function loginUsuarios(req, res) {
  let params = req.body;
  Usuarios.findOne({ usuario: params.usuario }, (err, usuariosEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (usuariosEncontrado) {
      bcrypt.compare(
        params.contrasena,
        usuariosEncontrado.contrasena,
        (err, passCorrecta) => {
          if (passCorrecta) {
            if (params.token === "true") {
              //obtenerToken es del lado de Postman
              return res.status(200).send({
                Token: jwt.createToken(usuariosEncontrado),
              });
            } else {
              usuariosEncontrado.password = undefined;
              return res.status(200).send({ usuariosEncontrado });
            }
          } else {
            return res
              .status(404)
              .send({ mensaje: "El usuario no se ha podido identificar" });
          }
        }
      );
    } else {
      return res
        .status(404)
        .send({ mensaje: "El usuario no ha podido ingresar" });
    }
  });
}

function buscarHabitaciones(req, res) {
  let params = req.body;
  if (req.usuarios.rol === "cliente") {
    if (params.nombre) {
      Hoteles.findOne({ nombre: params.nombre }, (err, hotelEncontrado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno en la peticion" });
        if (hotelEncontrado) {
          // console.log(hotelEncontrado);//SI TRAE EL HOTEL
          Habitaciones.find(
            { hotel: hotelEncontrado._id },
            (err, habitacionesEncontradas) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error interno en la peticion" });
              if (habitacionesEncontradas) {
                return res.status(200).send({ habitacionesEncontradas });
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "No encontraron habitaciones" });
              }
            }
          );
        } else {
          return res.status(500).send({ mensaje: "No se encontro el hotel" });
        }
      });
    }
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva de los clientes" });
  }
}

function buscarEventos(req, res) {
  let params = req.body;
  if (req.usuarios.rol === "cliente") {
    if (params.hotel) {
      Hoteles.findOne({ nombre: params.hotel }, (err, hotelEncontrado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno al buscar eventos" });
        if (hotelEncontrado) {
          console.log(hotelEncontrado);
          Eventos.find(
            { hotel: hotelEncontrado._id },
            (err, eventoEncontrado) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error interno al buscar eventos" });
              if (eventoEncontrado) {
                return res.status(200).send({ eventoEncontrado });
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "El hotel no tiene eventos" });
              }
            }
          );
        } else {
          return res.status(500).send({ mensaje: "El hotel no existe" });
        }
      });
    } else {
      return res.status(500).send({ mensaje: "Llene el campo obligatorio" });
    }
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva de los clientes" });
  }
}

function obtenerUsuarioID(req, res) {
  var idUsuario = req.params.idUsuario;
  Usuarios.findById(idUsuario, (err, idEncontrado) => {
    if (err)
      return res
        .status(500)
        .send({ mensaje: "Error en la peticion del Usuario" });
    if (!idEncontrado)
      return res
        .status(500)
        .send({ mensaje: "Error en obtener los datos del Usuario" });
    return res.status(200).send({ idEncontrado });
  });
}

function obtenerPerfil(req, res) {
  var idUsuario = req.params.idUsuario;
  Usuarios.findById(idUsuario, (err, perfilEncontrado) => {
    if (err)
      return res
        .status(500)
        .send({ mensaje: "Error en la peticion del Usuario" });
    if (!perfilEncontrado)
      return res
        .status(500)
        .send({ mensaje: "Error en obtener los datos del Usuario" });
    return res.status(200).send({ perfilEncontrado });
  });
}

function editarCuenta(req, res) {
  let clienteID = req.params.clienteID;
  let params = req.body;
  delete params.rol;
  delete params.contrasena;
  if (req.usuarios.rol === "cliente") {
    if (req.usuarios.sub === clienteID) {
      Usuarios.findByIdAndUpdate(
        // { clienteID},
        { _id: clienteID },
        params,
        { new: true },
        (err, usuarioEditado) => {
          if (err)
            return res
              .status(500)
              .send({ mensaje: "Error interno al editar usuario" });
          if (!usuarioEditado)
            return res
              .status(500)
              .send({ mensaje: "No se ha editado al usuario" });
          return res.status(200).send({ usuarioEditado });
        }
      );
    } else {
      return res
        .status(500)
        .send({ mensaje: "Esta tratando de editar un perfil que no es suyo" });
    }
  } else {
    return res
      .status(500)
      .send({ mensaje: "Opcion disponible solo para los clientes" });
  }
}

function eliminarCuenta(req, res) {
  let clienteID = req.params.clienteID;
  if (req.usuarios.rol === "cliente") {
    if (req.usuarios.sub === clienteID) {
      Usuarios.findByIdAndDelete(clienteID, (err, usuarioEliminado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno al eliminar usuario" });
        if (!usuarioEliminado)
          return res
            .status(500)
            .send({ mensaje: "No se pudo eliminar el usuario" });
        return res.status(200).send({ usuarioEliminado });
      });
    } else {
      return res.status(500).send({
        mensaje: "Esta tratando de eliminar un perfil que no es suyo",
      });
    }
  } else {
    return res
      .status(500)
      .send({ mensaje: "Opcion disponible solo para los clientes" });
  }
}

function reservar(req, res) {
  let habitacionID = req.params.habitacionID;
  let reservacionesModel = new Reservaciones();
  let params = req.body;
  if (req.usuarios.rol === "cliente") {
    if (req.usuarios.estado != "Hospedado") {
      reservacionesModel.fechaInicio = params.fechaInicio;
      reservacionesModel.fechaFin = params.fechaFin;
      Usuarios.findOneAndUpdate(
        { _id: req.usuarios.sub },
        { estado: "Hospedado" },
        { new: true, useFindAndModify: true },
        (err, usuarioActualizado) => {
          if (err)
            return res
              .status(500)
              .send({ mensaje: "Erro interno al cambiar estado del usuario" });
          if (usuarioActualizado) {
            reservacionesModel.usuario = usuarioActualizado._id;
            Habitaciones.findOneAndUpdate(
              { _id: habitacionID },
              { estado: "Ocupado" },
              { new: true, useFindAndModify: true },
              (err, habitacionActualizada) => {
                if (err)
                  return res.status(500).send({
                    mensaje: "Error interno al cambiar estado de habitacion",
                  });
                if (habitacionActualizada) {
                  reservacionesModel.habitacion = habitacionActualizada._id;
                  Usuarios.findOneAndUpdate(
                    { _id: req.usuarios.sub },
                    { hotelHospedado: habitacionActualizada.hotel },
                    { new: true, useFindAndModify: true },
                    (err, hotelActualizado) => {
                      if (err)
                        return res.status(500).send({
                          mensaje: "Error interno al actualizar hotel",
                        });
                      if (hotelActualizado) {
                        Usuarios.findOneAndUpdate();
                        reservacionesModel.save((err, reservacionGuardada) => {
                          if (reservacionGuardada) {
                            return res
                              .status(200)
                              .send({ reservacionGuardada });
                          } else {
                            return res.status(500).send({
                              mensaje: "Error al guarada reservacion",
                            });
                          }
                        });
                      } else {
                        return res
                          .status(500)
                          .send({ mensaje: "Error al actualizar hotel" });
                      }
                    }
                  );
                }
              }
            );
          } else {
            return res.status(500).send({ mensaje: "No se pudo actualizar" });
          }
        }
      );
    } else {
      return res
        .status(500)
        .send({ mensaje: "Ya se encuentra hospedado en un hotel" });
    }
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva de los clientes" });
  }
}

module.exports = {
  registrarUsuarios,
  loginUsuarios,
  editarCuenta,
  eliminarCuenta,
  buscarHabitaciones,
  buscarEventos,
  obtenerUsuarioID,
  reservar,
  obtenerPerfil,
};
