import { model, Schema } from "mongoose";
import { IPuntuacionBasica, puntuacionBasica } from "./puntuacionBasica";
import {
	IPuntuacionDefensiva,
	puntuacionDefensiva
} from "./puntuacionDefensiva";
import { IPuntuacionFisica, puntuacionFisica } from "./puntuacionFisica";
import { IPuntuacionOfensiva, puntuacionOfensiva } from "./puntuacionOfensiva";
import { IPuntuacionPortero, puntuacionPortero } from "./puntuacionPortero";
import { IPuntuacionPosesion, puntuacionPosesion } from "./puntuacionPosesion";

export const puntuacionJugador = new Schema<IPuntuacionJugador>(
	{
		idPartido: {
			type: String,
			required: true,
			trim: true,
		},
		semana: {
			type: Number,
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
			type: puntuacionFisica,
			required: true,
		},
		puntuacionPortero: {
			type: puntuacionPortero,
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
			trim: true,
		},
	},
	{
		_id: false,
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionJugador {
	idPartido: string;
	semana: number;
	puntos: number;
	puntuacionBasica: IPuntuacionBasica;
	puntuacionOfensiva: IPuntuacionOfensiva;
	puntuacionPoseision: IPuntuacionPosesion;
	puntuacionDefensiva: IPuntuacionDefensiva;
	puntuacionFisico: IPuntuacionFisica;
	puntuacionPortero: IPuntuacionPortero;
	idEquipo: string;
	idEquipoRival: string;
}

export const modelPuntuacionJugador = model<IPuntuacionJugador>(
	"puntuacionJugador",
	puntuacionJugador
);
