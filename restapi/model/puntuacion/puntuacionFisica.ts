const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const puntuacionFisica = new Schema(
  {
    duelosGanados: {
      type: Number,
      required: true,
    },
    duelosPerdidos: {
      type: Number,
      required: true,
    },
    duelosAereosGanados: {
      type: Number,
      required: true,
    },
    duelosAereosPerdidos: {
      type: Number,
      required: true,
    },
    posesionPerdida: {
      type: Number,
      required: true,
    },
    faltasCometidas: {
      type: Number,
      required: true,
    },
    faltasRecibidas: {
      type: Number,
      required: true,
    },
    fuerasDeJuego: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const modeloPuntuacionFisica = model(
  "PuntuacionFisica",
  puntuacionFisica
);
