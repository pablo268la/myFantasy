const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const jugador = new Schema(
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
    posicion: {
      type: String,
      trim: true,
      enum: ["Portero", "Defensa", "Mediocentro", "Delantero"],
    },
    equipo: {
      type: String,
      trim: true,
    },
    valor: {
      type: Number,
      required: true,
    },
    puntos: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      required: true,
      enum: ["Disponible", "Dudoso", "Lesionado", "No inscrito"],
    },
    foto: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const modeloJugador = model("Jugador", jugador);
