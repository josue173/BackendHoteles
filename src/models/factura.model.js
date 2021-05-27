"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

var facturasSchema = Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "usuarios" },
  reservacion: { type: Schema.Types.ObjectId, ref: "reservaciones" },
  fechaIncio: String,
  fechaFin: String,
  habitacion: { type: Schema.Types.ObjectId, ref: "habitaciones" },
  total: Number,
  servicios: [{ type: Schema.Types.ObjectId, ref: "servicios" }],
});

module.exports = mongoose.model("facturas", facturasSchema);
