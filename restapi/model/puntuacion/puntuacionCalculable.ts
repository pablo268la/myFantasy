import { model, Schema } from "mongoose";

import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     PuntuacionCalculable:
 *       type: object
 *       properties:
 *         golesRecibidos:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         tarjetasAmarilla:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         tarjetasRoja:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         dobleAmarilla:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         playerIn:
 *          type: number
 *         playerOut:
 *          type: number
 */

export const puntuacionCalculable = new Schema<IPuntuacionCalculable>(
	{
		golesRecibidos: {
			type: puntuacionTupple,
			required: true,
		},
		tarjetasAmarilla: {
			type: puntuacionTupple,
			required: true,
		},
		tarjetasRoja: {
			type: puntuacionTupple,
			required: true,
		},
		dobleAmarilla: {
			type: puntuacionTupple,
			required: true,
		},
		playerIn: {
			type: Number,
			required: true,
		},
		playerOut: {
			type: Number,
			required: true,
		},
	},
	{
		id: false,
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionCalculable {
	golesRecibidos: IPuntuacionTupple;
	tarjetasAmarilla: IPuntuacionTupple;
	tarjetasRoja: IPuntuacionTupple;
	dobleAmarilla: IPuntuacionTupple;
	playerIn: number;
	playerOut: number;
}

export const modelPuntuacionCalculable = model<IPuntuacionCalculable>(
	"puntuacionCalculable",
	puntuacionCalculable
);
