import { jugador } from "./jugador";

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const equipo = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    jugadores: {
      type: [jugador],
    },
    escudo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
