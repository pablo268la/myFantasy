import { puntuacionBasica } from "./puntuacionBasica";
import { puntuacionDefensiva } from "./puntuacionDefensiva";
import { puntuacionFisica } from "./puntuacionFisica";
import { puntuacionOfensiva } from "./puntuacionOfensiva";
import { puntuacionPortero } from "./puntuacionPortero";
import { puntuacionPosesion } from "./puntuacionPosesion";

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const puntuacionJugador = new Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    idJugador: {
      type: String,
      required: true,
      trim: true,
    },
    semana: {
      type: Number,
      required: true,
    },
    idPartido: {
      type: String,
      required: true,
      trim: true,
    },
    puntos: {
      type: Number,
      required: true,
    },
    puntuacionBasica: {
      type: puntuacionBasica,
      required: true,
    },
    puntuacionOfensiva: {
      type: puntuacionOfensiva,
      required: true,
    },
    puntuacionPoseision: {
      type: puntuacionPosesion,
      required: true,
    },
    puntuacionDefensiva: {
      type: puntuacionDefensiva,
      required: true,
    },
    puntuacionFisico: {
      type: puntuacionFisica,
      required: true,
    },
    puntuacionPortero: {
      type: puntuacionPortero,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export const modelPuntuacionJugador = model("puntuacionJugador", puntuacionJugador);