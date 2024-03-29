import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";


/**
 * @openapi
 * 
 * components:
 *   schemas:
 *     PuntuacionDefensiva:
 *       type: object
 *       properties:
 *         despejes:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         tirosBloqueados:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         intercepciones:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         entradas:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         regatesSuperado:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         erroresParaDisparo:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         despejesEnLineaDeGol:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         golesEnPropia:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 *         penaltiCometido:
 *           $ref: '#/components/schemas/IPuntuacionTupple'
 */

export const puntuacionDefensiva = new Schema<IPuntuacionDefensiva>(
	{
		despejes: {
			type: puntuacionTupple,
			required: true,
		},
		tirosBloqueados: {
			type: puntuacionTupple,
			required: true,
		},
		intercepciones: {
			type: puntuacionTupple,
			required: true,
		},
		entradas: {
			type: puntuacionTupple,
			required: true,
		},
		regatesSuperado: {
			type: puntuacionTupple,
			required: true,
		},
		erroresParaDisparo: {
			type: puntuacionTupple,
			required: true,
		},
		despejesEnLineaDeGol: {
			type: puntuacionTupple,
			required: true,
		},
		golesEnPropia: {
			type: puntuacionTupple,
			required: true,
		},
		penaltiCometido: {
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

export interface IPuntuacionDefensiva {
	despejes: IPuntuacionTupple;
	tirosBloqueados: IPuntuacionTupple;
	intercepciones: IPuntuacionTupple;
	entradas: IPuntuacionTupple;
	regatesSuperado: IPuntuacionTupple;
	erroresParaDisparo: IPuntuacionTupple;
	despejesEnLineaDeGol: IPuntuacionTupple;
	golesEnPropia: IPuntuacionTupple;
	penaltiCometido: IPuntuacionTupple;
}

export const modelPuntuacionDefensiva = model<IPuntuacionDefensiva>(
	"puntuacionDefensiva",
	puntuacionDefensiva
);
