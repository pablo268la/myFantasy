import { puntuacionBasica } from "./puntuacionBasica";
import { puntuacionDefensiva } from "./puntuacionDefensiva";
import { modeloPuntuacionFisica } from "./puntuacionFisica";
import { puntuacionOfensiva } from "./puntuacionOfensiva";
import { modeloPuntuacionPortero } from "./puntuacionPortero";
import { puntuacionPosesion } from "./puntuacionPosesion";

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const puntuacionJugador = new Schema(
  {
    id: {
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
    idEquipo: {
      type: String,
      required: true,
      trim: true,
    },
    idEquipoRival: {
      type: String,
      required: true,
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
      type: modeloPuntuacionFisica,
      required: true,
    },
    puntuacionPortero: {
      type: modeloPuntuacionPortero,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const modeloPuntuacionJugador = model(
  "PuntuacionJugador",
  puntuacionJugador
);
