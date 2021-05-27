"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var habitacionesSchema = Schema({
  nombreHabitacion: String,
  estado: String,
  descripcion: String,
  precio: Number,
  imagen: String,
  hotel: { type: Schema.Types.ObjectId, ref: "hoteles" },
});

module.exports = mongoose.model("habitaciones", habitacionesSchema);
