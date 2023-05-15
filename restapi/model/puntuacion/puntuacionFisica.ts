import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     PuntuacionFisica:
 *       type: object
 *       properties:
 *         duelosGanados:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         duelosPerdidos:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         duelosAereosGanados:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         duelosAereosPerdidos:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         posesionPerdida:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         faltasCometidas:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         faltasRecibidas:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         fuerasDeJuego:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 */

export const puntuacionFisica = new Schema<IPuntuacionFisica>(
	{
		duelosGanados: {
			type: puntuacionTupple,
			required: true,
		},
		duelosPerdidos: {
			type: puntuacionTupple,
			required: true,
		},
		duelosAereosGanados: {
			type: puntuacionTupple,
			required: true,
		},
		duelosAereosPerdidos: {
			type: puntuacionTupple,
			required: true,
		},
		posesionPerdida: {
			type: puntuacionTupple,
			required: true,
		},
		faltasCometidas: {
			type: puntuacionTupple,
			required: true,
		},
		faltasRecibidas: {
			type: puntuacionTupple,
			required: true,
		},
		fuerasDeJuego: {
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

export interface IPuntuacionFisica {
	duelosGanados: IPuntuacionTupple;
	duelosPerdidos: IPuntuacionTupple;
	duelosAereosGanados: IPuntuacionTupple;
	duelosAereosPerdidos: IPuntuacionTupple;
	posesionPerdida: IPuntuacionTupple;
	faltasCometidas: IPuntuacionTupple;
	faltasRecibidas: IPuntuacionTupple;
	fuerasDeJuego: IPuntuacionTupple;
}

export const modelPuntuacionFisica = model<IPuntuacionFisica>(
	"puntuacionFisica",
	puntuacionFisica
);
