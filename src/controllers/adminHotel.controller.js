"use strict";

const Habitaciones = require("../models/habitaciones.model");
const Hoteles = require("../models/hoteles.model");
const Eventos = require("../models/eventos.model");
const Servicios = require("../models/servicios.model");
const Reservaciones = require("../models/reservaciones.model");
const Usuarios = require("../models/usuarios.model");
const e = require("cors");

var habitacionesModel = new Habitaciones();
var eventosModel = new Eventos();
var serviciosModel = new Servicios();

function agregarHabitaciones(req, res) {
  let params = req.body;
  if (req.usuarios.rol === "AministradorHotel") {
    if (
      params.nombreHabitacion &&
      params.precio &&
      params.descripcion &&
      params.imagen
    ) {
      habitacionesModel.nombreHabitacion = params.nombreHabitacion;
      habitacionesModel.precio = params.precio;
      habitacionesModel.descripcion = params.descripcion;
      habitacionesModel.imagen = params.imagen;
      habitacionesModel.estado = "Disponible";
      Hoteles.findOne(
        { administradorHotel: req.usuarios.sub },
        (err, hotelEncontrado) => {
          if (err)
            return res
              .status(500)
              .send({ mensaje: "Error interno al compara IDs" });
          if (hotelEncontrado) {
            habitacionesModel.hotel = hotelEncontrado._id;
            habitacionesModel.save((err, habitacionAgregada) => {
              if (habitacionAgregada) {
                return res.status(200).send({ habitacionAgregada });
              } else {
                return res.status(500).send({
                  mensaje: "Error interno al agregar habitacion",
                });
              }
            });
          } else {
            return res
              .status(500)
              .send({ mensaje: "Usted no esta acargo de ningun hotel" });
          }
        }
      );
    } else {
      return res
        .status(500)
        .send({ mensaje: "Llene los campos hobligatorios" });
    }
  } else {
    return res
      .status(500)
      .send({ mensaje: "Esta opcion solo es para adiminstradores de hotel" });
  }
}
//FUNCIONA AL 100

function verEventos(req, res) {
  if (req.usuarios.rol === "AministradorHotel") {
    Hoteles.findOne(
      { administradorHotel: req.usuarios.sub },
      (err, adminEncontrado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Erro interno al verificar el hotel" });
        if (adminEncontrado) {
          Eventos.find(
            { hotel: adminEncontrado._id },
            (err, eventoEncontrado) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error interno al buscar habitaciones" });
              if (eventoEncontrado) {
                return res.status(200).send({ eventoEncontrado });
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "Todas las habitaciones estan ocupadas" });
              }
            }
          );
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Esta opcion solo es para adiminstradores de hotel" });
  }
}

function agregarEventos(req, res) {
  let params = req.body;
  if (req.usuarios.rol === "AministradorHotel") {
    Hoteles.findOne(
      { administradorHotel: req.usuarios.sub },
      (err, hotelAdmin) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno al verificar administrador" });
        if (hotelAdmin) {
          Eventos.find({
            //VERIFICA QUE EL EVENTO NO EXISTA DOS VECES EN UN HOTEL
            $and: [{ nombre: params.nombre }, { hotel: hotelAdmin._id }],
          }).exec((err, eventoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error interno" });
            if (eventoEncontrado && eventoEncontrado.length >= 1) {
              return res
                .status(500)
                .send({ mensaje: "El eventos ya existe en este hotel" });
            } else {
              eventosModel.nombre = params.nombre;
              eventosModel.descripcion = params.descripcion;
              eventosModel.hotel = hotelAdmin._id;
              eventosModel.save((err, eventoAgregado) => {
                if (eventoAgregado) {
                  return res.status(200).send({ eventoAgregado });
                } else {
                  return res
                    .status(500)
                    .send({ mensaje: "Error al agregar evento" });
                }
              });
            }
          });
        } else {
          return res
            .status(500)
            .send({ mensaje: "El administrador no esta a cargo de un hotel" });
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Esta opcion solo es para adiminstradores de hotel" });
  }
}

function verServicios(req, res) {
  if (req.usuarios.rol === "AministradorHotel") {
    Hoteles.findOne(
      { administradorHotel: req.usuarios.sub },
      (err, adminEncontrado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Erro interno al verificar el hotel" });
        if (adminEncontrado) {
          Servicios.find(
            { hotel: adminEncontrado._id },
            (err, servicioEncontrados) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error interno al buscar habitaciones" });
              if (servicioEncontrados) {
                return res.status(200).send({ servicioEncontrados });
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "Todas las habitaciones estan ocupadas" });
              }
            }
          );
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Esta opcion solo es para adiminstradores de hotel" });
  }
}

function agregarServicios(req, res) {
  let params = req.body;
  if (req.usuarios.rol === "AministradorHotel") {
    serviciosModel.nombreServicio = params.nombre;
    serviciosModel.descripcionServicio = params.descripcion;
    Hoteles.findOne(
      { administradorHotel: req.usuarios.sub },
      (err, hotelAdmin) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno al verificar administrador" });
        if (hotelAdmin) {
          Servicios.find({
            //VERIFICA QUE EL SERVICIO NO EXISTA DOS VECES EN UN HOTEL
            $and: [
              { nombreServicio: params.nombre },
              { hotel: hotelAdmin._id },
            ],
          }).exec((err, servicioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error interno" });
            if (servicioEncontrado && servicioEncontrado.length >= 1) {
              return res
                .status(500)
                .send({ mensaje: "El servicio ya existe en este hotel" });
            } else {
              serviciosModel.hotel = hotelAdmin._id;
              serviciosModel.save((err, servicioAgregado) => {
                if (servicioAgregado) {
                  return res.status(200).send({ servicioAgregado });
                } else {
                  return res
                    .status(500)
                    .send({ mensaje: "Error al agregar servicio" });
                }
              });
            }
          });
        } else {
          return res
            .status(500)
            .send({ mensaje: "El administrador no esta a cargo de un hotel" });
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Esta opcion solo es para adiminstradores de hotel" });
  }
}

function habitacionesDisponibles(req, res) {
  if (req.usuarios.rol === "AministradorHotel") {
    Hoteles.findOne(
      { administradorHotel: req.usuarios.sub },
      (err, adminEncontrado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Erro interno al verificar el hotel" });
        if (adminEncontrado) {
          Habitaciones.find(
            { hotel: adminEncontrado._id },
            (err, habitacionesEncontradas) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error interno al buscar habitaciones" });
              if (habitacionesEncontradas) {
                return res.status(200).send({ habitacionesEncontradas });
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "Todas las habitaciones estan ocupadas" });
              }
            }
          );
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Esta opcion solo es para adiminstradores de hotel" });
  }
}

function verReservaciones(req, res) {
  if (req.usuarios.rol === "AministradorHotel") {
    Hoteles.findOne(
      { administradorHotel: req.usuarios.sub },
      (err, hotelAdmin) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Erro interno al verificar el hotel" });
        if (hotelAdmin) {
          Habitaciones.findOne(
            { hotel: hotelAdmin._id },
            (err, habitacionEncontrada) => {
              if (err)
                return res.status(500).send({ mensaje: "Error al verificar" });
              if (habitacionEncontrada) {
                Reservaciones.find(
                  { habitacion: habitacionEncontrada._id },
                  (err, reservacionesEncontradas) => {
                    if (err)
                      return res.status(500).send({
                        mensaje: "Error interno al buscar reservaciones",
                      });
                    if (reservacionesEncontradas) {
                      return res.status(200).send({ reservacionesEncontradas });
                    } else {
                      return res.status(500).send({
                        mensaje: "No hay reservaciones hechas en este hotel",
                      });
                    }
                  }
                );
              } else {
                return res.status(500).send({ mensaje: "Error al verificar" });
              }
            }
          );
        } else {
          return res
            .status(500)
            .send({ mensaje: "El administrador no esta a cargo de un hotel" });
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Usted no es administrador de hotel" });
  }
}

function buscarHospedajes(req, res) {
  let params = req.body;
  if (req.usuarios.rol === "AministradorHotel") {
    Hoteles.findOne(
      { administradorHotel: req.usuarios.sub },
      (err, hotelAdmin) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno al verificar hotel" });
        if (hotelAdmin) {
          Usuarios.findOne({
            $and: [
              { usuario: params.buscar },
              { hotelHospedado: hotelAdmin._id },
            ],
          }).exec((err, usuarioEncontrado) => {
            if (err)
              return res
                .status(500)
                .send({ mensaje: "Error interno al verificar cliente" });
            if (usuarioEncontrado) {
              return res.status(200).send({ usuarioEncontrado });
            } else {
              return res
                .status(500)
                .send({ mensaje: "El cliente no se encuentra en su hotel" });
            }
          });
        } else {
          return res
            .status(500)
            .send({ mensaje: "Usted no esta acargo de ningun hotel" });
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva de los administradores de hoteles" });
  }
}

function verHospedajes(req, res) {
  if (req.usuarios.rol === "AministradorHotel") {
    Hoteles.findOne(
      { administradorHotel: req.usuarios.sub },
      (err, hotelAdmin) => {
        if (err)
          return res.status(500).send({
            mensaje: "Error interno al verificar administrador de hotel",
          });
        if (hotelAdmin) {
          Usuarios.find(
            { hotelHospedado: hotelAdmin._id },
            (err, hospedajesEncontrados) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error interno al verificar usuarios" });
              if (hospedajesEncontrados) {
                return res.status(200).send({ hospedajesEncontrados });
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "No hay clientes hospedados en su hotel" });
              }
            }
          );
        } else {
          return res
            .status(500)
            .send({ mensaje: "Usted no esta acarga de ningun hotel" });
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva de administradores de hotel" });
  }
}

function crearFactura(req, res) {
  if (req.usuarios.rol == "AministradorHotel") {
    let idReservacion = req.params.idReservacion;
    var facturaModel = new Factura();
    Factura.findOne(
      { idReservacion: idReservacion },
      (err, facturaEncontrada) => {
        if (!facturaEncontrada) {
          Reservacion.findById(idReservacion, (err, reservacionEncontrada) => {
            Hotel.findOne(
              { "habitaciones._id": reservacionEncontrada.idHabitacion },
              (err, hotelEncontrado) => {
                Hotel.findByIdAndUpdate(
                  hotelEncontrado._id,
                  { $inc: { popularidad: 1 } },
                  (err, hotelActualizado) => {
                    console.log(hotelActualizado);

                    Servicio.find(
                      { idHotel: hotelEncontrado._id },
                      (err, serviciosEncontrados) => {
                        var total = 0;

                        for (
                          let i = 0;
                          i < hotelEncontrado.habitaciones.length;
                          i++
                        ) {
                          if (
                            reservacionEncontrada.idHabitacion.equals(
                              hotelEncontrado.habitaciones[i]._id
                            )
                          ) {
                            total += hotelEncontrado.habitaciones[i].precio;
                          }
                        }

                        for (let i = 0; i < serviciosEncontrados.length; i++) {
                          total += serviciosEncontrados[i].subtotal;
                          //facturaModel.serviciosHotel.idServicio = serviciosEncontrados[i]._id;
                          facturaModel.serviciosHotel.push(
                            serviciosEncontrados[i]._id
                          );
                        }

                        facturaModel.fecha_llegada =
                          reservacionEncontrada.fecha_llegada;
                        facturaModel.fecha_salida =
                          reservacionEncontrada.fecha_salida;
                        facturaModel.idHabitacion =
                          reservacionEncontrada.idHabitacion;
                        facturaModel.idUsuario =
                          reservacionEncontrada.idUsuario;
                        facturaModel.idReservacion = idReservacion;
                        facturaModel.total = total;

                        facturaModel.save((err, facturaGuardada) => {
                          if (err)
                            return res
                              .status(500)
                              .send({ mensaje: "Error en la petición", err });

                          if (!facturaGuardada)
                            return res
                              .status(500)
                              .send({ mensaje: "Error al guardar la factura" });

                          return res.status(200).send({ facturaGuardada });
                        });
                      }
                    );
                  }
                );
              }
            );
          });
        } else {
          return res
            .status(500)
            .send({ mensaje: "Ya existe una factura creada" });
        }
      }
    );
  }
}

module.exports = {
  agregarHabitaciones,
  verEventos,
  agregarEventos,
  verServicios,
  agregarServicios,
  habitacionesDisponibles,
  verReservaciones,
  buscarHospedajes,
  verHospedajes,
};
