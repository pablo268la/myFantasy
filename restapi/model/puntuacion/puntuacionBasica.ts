const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const puntuacionBasica = new Schema(
  {
    minutos: {
      type: Number,
      required: true,
    },
    goles: {
      type: Number,
      required: true,
    },
    asistencias: {
      type: Number,
      required: true,
    },
    valoracion: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);