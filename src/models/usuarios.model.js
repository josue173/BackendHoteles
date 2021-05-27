"use strict";

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let usuariosSchema = Schema({
  usuario: String,
  email: String,
  contrasena: String,
  estado: String,
  rol: String,
  hotelHospedado: { type: Schema.Types.ObjectId, ref: "hoteles" },
});

module.exports = mongoose.model("usuarios", usuariosSchema);
