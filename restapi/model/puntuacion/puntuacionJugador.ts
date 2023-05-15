import { model, Schema } from "mongoose";
import { IPuntuacionBasica, puntuacionBasica } from "./puntuacionBasica";
import {
	IPuntuacionCalculable,
	puntuacionCalculable,
} from "./puntuacionCalculable";
import {
	IPuntuacionDefensiva,
	puntuacionDefensiva,
} from "./puntuacionDefensiva";
import { IPuntuacionFisica, puntuacionFisica } from "./puntuacionFisica";
import { IPuntuacionOfensiva, puntuacionOfensiva } from "./puntuacionOfensiva";
import { IPuntuacionPortero, puntuacionPortero } from "./puntuacionPortero";
import { IPuntuacionPosesion, puntuacionPosesion } from "./puntuacionPosesion";

/**
 * @openapi
 * components:
 *  schemas:
 *   PuntuacionJugador:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *     idJugador:
 *      type: string
 *     idPartido:
 *      type: string
 *     semana:
 *      type: number
 *     puntos:
 *      type: number
 *     puntuacionBasica:
 *      $ref: '#/components/schemas/PuntuacionBasica'
 *     puntuacionOfensiva:
 *      $ref: '#/components/schemas/PuntuacionOfensiva'
 *     puntuacionPosesion:
 *      $ref: '#/components/schemas/PuntuacionPosesion'
 *     puntuacionDefensiva:
 *      $ref: '#/components/schemas/PuntuacionDefensiva'
 *     puntuacionFisico:
 *      $ref: '#/components/schemas/PuntuacionFisica'
 *     puntuacionPortero:
 *      $ref: '#/components/schemas/PuntuacionPortero'
 *     puntuacionCalculable:
 *      $ref: '#/components/schemas/PuntuacionCalculable'
 *     idEquipo:
 *      type: string
 *     idEquipoRival:
 *      type: string

 */

export const puntuacionJugador = new Schema<IPuntuacionJugador>(
	{
		id: {
			type: String,
			trim: true,
			required: true,
		},
		idJugador: {
			type: String,
			required: true,
			trim: true,
		},
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
		puntuacionPosesion: {
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
		puntuacionCalculable: {
			type: puntuacionCalculable,
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
		id: false,
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionJugador {
	id: string;
	idJugador: string;
	idPartido: string;
	semana: number;
	puntos: number;
	puntuacionBasica: IPuntuacionBasica;
	puntuacionOfensiva: IPuntuacionOfensiva;
	puntuacionPosesion: IPuntuacionPosesion;
	puntuacionDefensiva: IPuntuacionDefensiva;
	puntuacionFisico: IPuntuacionFisica;
	puntuacionPortero: IPuntuacionPortero;
	puntuacionCalculable: IPuntuacionCalculable;
	idEquipo: string;
	idEquipoRival: string;
}

puntuacionJugador.index({ idJugador: 1, idPartido: 1 }, { unique: true });

export const modelPuntuacionJugador = model<IPuntuacionJugador>(
	"puntuacionJugador",
	puntuacionJugador
);
