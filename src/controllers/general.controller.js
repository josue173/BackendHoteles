"use strict";

const Hoteles = require("../models/hoteles.model");
const Habitaciones = require("../models/habitaciones.model");
const Servicios = require("../models/servicios.model");

function verHoteles(req, res) {
  Hoteles.find((err, hotelesEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error interno" });
    if (!hotelesEncontrados)
      return res
        .status(500)
        .send({ mensaje: "No hay hoteles para visualizar" });
    return res.status(200).send({ hotelesEncontrados });
  });
}

function buscarHotel(req, res) {
  var params = req.body;
  if (params.buscar) {
    Hoteles.find({
      $or: [{ nombre: params.buscar }, { direccion: params.buscar }],
    }).exec((err, hotelEncontrado) => {
      // if (err)
      //   return res
      //     .status(500)
      //     .send({ mensaje: "Error interno al buscar el hotel" });
      // if (!hotelEncontrado)
      //   return res
      //     .status(500)
      //     .send({ mensaje: "El hotel que busca no existe" });
      // return res.status(200).send({ hotelEncontrado });
      if (hotelEncontrado) {
        return res.status(200).send({ hotelEncontrado });
      } else {
        return res
          .status(500)
          .send({ mensaje: "El hotel que busca no existe" });
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Llene el campo solicitado" });
  }
}

function verHotel(req, res) {
  let hotelID = req.params.hotelID;
  Hoteles.findById(hotelID, (err, hotelEncontrado) => {
    if (err)
      return res
        .status(500)
        .send({ mensaje: "Error interno al buscar el hotel" });
    if (hotelEncontrado) {
      return res.status(200).send({ hotelEncontrado });
    } else {
      return res.status(500).send({ mensaje: "El hotel no existe" });
    }
  });
}

function verHabitaciones(req, res) {
  let hotelHabitacionID = req.params.hotelHabitacionID;
  Habitaciones.find(
    { hotel: hotelHabitacionID },
    (err, habitacionesEncontradas) => {
      if (err)
        return res
          .status(500)
          .send({ mensaje: "Error interno al buscar el hotel" });
      if (habitacionesEncontradas) {
        return res.status(200).send({ habitacionesEncontradas });
      } else {
        return res
          .status(500)
          .send({ mensaje: "No hay habitaciones disponibles" });
      }
    }
  );
}

function verTodasHabitaciones(req, res) {
  Habitaciones.find((err, habitacionesEncontradas) => {
    if (err)
      return res
        .status(500)
        .send({ mensaje: "Error interno al buscar habitadciones" });
    if (habitacionesEncontradas) {
      return res.status(200).send({ habitacionesEncontradas });
    } else {
      return res
        .status(500)
        .send({ mensaje: "No hay habitaciones para visualizar" });
    }
  });
}

function verHabitacion(req, res) {
  let habitacionID = req.params.habitacionID;
  Habitaciones.findById(habitacionID, (err, habitacionEncontrada) => {
    if (err)
      return res
        .status(500)
        .send({ mensaje: "Error interno al buscar el hotel" });
    if (habitacionEncontrada) {
      return res.status(200).send({ habitacionEncontrada });
    } else {
      return res
        .status(500)
        .send({ mensaje: "No hay habitaciones" });
    }
  });
}

function verServicios(req, res) {
  let hoteServiciolID = req.params.hoteServiciolID;
  Servicios.find({ hotel: hoteServiciolID }, (err, serviciosEncontrados) => {
    if (err)
      return res
        .status(500)
        .send({ mensaje: "Error interno al buscar el hotel" });
    if (serviciosEncontrados) {
      return res.status(200).send({ serviciosEncontrados });
    } else {
      return res
        .status(500)
        .send({ mensaje: "No hay servicios en este hotel" });
    }
  });
}

module.exports = {
  verHoteles,
  buscarHotel,
  verHotel,
  verHabitaciones,
  verHabitacion,
  verServicios,
  verTodasHabitaciones,
};
