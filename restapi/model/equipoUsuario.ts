import { jugador } from "./jugador";

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const equipoUsuario = new Schema(
  {
    id: {
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
    jugadores: {
      type: [jugador],
    },
    idAlineacion: {
      type: String,
      required: true,
      trim: true,
    },
    idAlineacionesSemana: {
      type: [String],
    },
    valor: {
      type: Number,
      required: true,
    },
    puntos: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);
