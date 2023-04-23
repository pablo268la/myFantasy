import { model, Schema } from "mongoose";

import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     PuntuacionPosesion:
 *       type: object
 *       properties:
 *         toquesBalon:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         pasesTotales:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         pasesCompletados:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         pasesClave:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         centrosTotales:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         centrosCompletados:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         pasesLargosTotales:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         pasesLargosCompletados:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         grandesOcasiones:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 */

export const puntuacionPosesion = new Schema<IPuntuacionPosesion>(
	{
		toquesBalon: {
			type: puntuacionTupple,
			required: true,
		},
		pasesTotales: {
			type: puntuacionTupple,
			required: true,
		},
		pasesCompletados: {
			type: puntuacionTupple,
			required: true,
		},
		pasesClave: {
			type: puntuacionTupple,
			required: true,
		},
		centrosTotales: {
			type: puntuacionTupple,
			required: true,
		},
		centrosCompletados: {
			type: puntuacionTupple,
			required: true,
		},
		pasesLargosTotales: {
			type: puntuacionTupple,
			required: true,
		},
		pasesLargosCompletados: {
			type: puntuacionTupple,
			required: true,
		},
		grandesOcasiones: {
			type: puntuacionTupple,
			required: true,
		},
	},
	{
		_id: false,
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionPosesion {
	toquesBalon: IPuntuacionTupple;
	pasesTotales: IPuntuacionTupple;
	pasesCompletados: IPuntuacionTupple;
	pasesClave: IPuntuacionTupple;
	centrosTotales: IPuntuacionTupple;
	centrosCompletados: IPuntuacionTupple;
	pasesLargosTotales: IPuntuacionTupple;
	pasesLargosCompletados: IPuntuacionTupple;
	grandesOcasiones: IPuntuacionTupple;
}

export const modelPuntuacionPosesion = model<IPuntuacionPosesion>(
	"puntuacionPosesion",
	puntuacionPosesion
);
