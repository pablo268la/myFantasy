const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const transferencia = new Schema(
  {
    idComprador: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    idVendedor: {
      type: String,
      required: true,
      trim: true,
    },
    idJugador: {
      type: String,
      required: true,
      trim: true,
    },
    coste: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      required: true,
      trim: true,
      enum: ["ACEPTADA", "RECHAZADA", "ACTIVA"],
    },
    fechaLimite: {
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

export const modeloTransferencia = model("transferencia", transferencia);
