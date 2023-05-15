import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     PuntuacionPortero:
 *       type: object
 *       properties:
 *         paradas:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         despejes:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         salidas:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         highClaim:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         paradasArea:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         penaltiesParados:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 */

export const puntuacionPortero = new Schema<IPuntuacionPortero>(
	{
		paradas: {
			type: puntuacionTupple,
			required: true,
		},
		despejes: {
			type: puntuacionTupple,
			required: true,
		},
		salidas: {
			type: puntuacionTupple,
			required: true,
		},
		highClaim: {
			type: puntuacionTupple,
			required: true,
		},
		paradasArea: {
			type: puntuacionTupple,
			required: true,
		},
		penaltiesParados: {
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

export interface IPuntuacionPortero {
	paradas: IPuntuacionTupple;
	despejes: IPuntuacionTupple;
	salidas: IPuntuacionTupple;
	highClaim: IPuntuacionTupple;
	paradasArea: IPuntuacionTupple;
	penaltiesParados: IPuntuacionTupple;
}

export const modelPuntuacionPortero = model<IPuntuacionPortero>(
	"puntuacionPortero",
	puntuacionPortero
);
