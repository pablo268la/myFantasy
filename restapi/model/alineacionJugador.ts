import { model, Schema } from "mongoose";
import { IPropiedadJugador, propiedadJugador } from "./propiedadJugador";

/**
 * @openapi
 * components:
 *  schemas:
 *   AlineacionJugador:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *     porteros:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/PropiedadJugador'
 *     defensas:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/PropiedadJugador'
 *     medios:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/PropiedadJugador'
 *     delanteros:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/PropiedadJugador'
 *     formacion:
 *      type: string
 *      enum: ["5-4-1", "5-3-2", "4-5-1", "4-4-2", "4-3-3", "3-5-2", "3-4-3"]
 *     guardadoEn:
 *      type: string
 *     idLiga:
 *      type: string
 */

export const alineacionJugador = new Schema<IAlineacionJugador>(
	{
		id: {
			type: String,
			required: true,
			trim: true,
			
		},
		porteros: {
			type: [propiedadJugador],
			required: true,
			trim: true,
		},
		defensas: {
			type: [propiedadJugador],
			required: true,
			trim: true,
		},
		medios: {
			type: [propiedadJugador],
			required: true,
			trim: true,
		},
		delanteros: {
			type: [propiedadJugador],
			required: true,
			trim: true,
		},
		formacion: {
			type: String,
			required: true,
			trim: true,
			enum: ["5-4-1", "5-3-2", "4-5-1", "4-4-2", "4-3-3", "3-5-2", "3-4-3"],
		},
		guardadoEn: {
			type: String,
			required: true,
			trim: true,
		},
		idLiga: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
)

export interface IAlineacionJugador {
	id: string;
	porteros: IPropiedadJugador[];
	defensas: IPropiedadJugador[];
	medios: IPropiedadJugador[];
	delanteros: IPropiedadJugador[];
	formacion: string;
	guardadoEn: string;
	idLiga: string;
}

export const modeloAlineacionJugador = model<IAlineacionJugador>(
	"alineacionJugador",
	alineacionJugador
);
