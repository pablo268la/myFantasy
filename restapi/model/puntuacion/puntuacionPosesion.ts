const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const puntuacionPosesion = new Schema(
  {
    toquesBalon: {
      type: Number,
      required: true,
    },
    pasesTotales: {
      type: Number,
      required: true,
    },
    pasesCompletados: {
      type: Number,
      required: true,
    },
    pasesClave: {
      type: Number,
      required: true,
    },
    centrosTotales: {
      type: Number,
      required: true,
    },
    centrosCompletados: {
      type: Number,
      required: true,
    },
    pasesLargosTotales: {
      type: Number,
      required: true,
    },
    pasesLargosCompletados: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);