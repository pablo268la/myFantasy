const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const propiedadJugador = new Schema(
  {
    idJugador: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    idUsuario: {
      type: String,
      required: true,
      trim: true,
    },
    idLiga: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export const modeloPropiedadJugador = model("propiedadJugador", propiedadJugador);