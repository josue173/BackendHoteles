"use strict";

const mongoose = require("mongoose");

let Schema = mongoose.Schema;

var serviciosSchema = Schema({
  nombreServicio: String,
  descripcionServicio: String,
  hotel: { type: Schema.Types.ObjectId, ref: "servicios" },
});

module.exports = mongoose.model("servicios", serviciosSchema);
