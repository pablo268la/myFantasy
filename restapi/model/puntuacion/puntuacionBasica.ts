import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *
 *     PuntuacionBasica:
 *       type: object
 *       properties:
 *         minutos:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         goles:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         asistencias:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         valoracion:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 */
export const puntuacionBasica = new Schema<IPuntuacionBasica>(
	{
		minutos: {
			type: puntuacionTupple,
			required: true,
		},
		goles: {
			type: puntuacionTupple,
			required: true,
		},
		asistencias: {
			type: puntuacionTupple,
			required: true,
		},
		valoracion: {
			type: puntuacionTupple,
			required: true,
		},
	},
	{
		id: false,
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionBasica {
	minutos: IPuntuacionTupple;
	goles: IPuntuacionTupple;
	asistencias: IPuntuacionTupple;
	valoracion: IPuntuacionTupple;
}

export const modelPuntuacionBasica = model<IPuntuacionBasica>(
	"puntuacionBasica",
	puntuacionBasica
);
