import { model, Schema } from "mongoose";
import { alineacionJugador, IAlineacionJugador } from "./alineacionJugador";
import { IUsuario, usuario } from "./usuario";

/**
 * @openapi
 * components:
 *  schemas:
 *   PlantillaUsuario:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *     usuario:
 *      $ref: '#/components/schemas/Usuario'
 *     idLiga:
 *      type: string
 *     alineacionJugador:
 *      $ref: '#/components/schemas/AlineacionJugador'
 *     alineacionesJornada:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/AlineacionJugador'
 *     valor:
 *      type: number
 *      format: double
 *     puntos:
 *      type: number
 *     dinero:
 *      type: number
 *      format: double
 */

export const plantillaUsuario = new Schema<IPlantillaUsuario>(
	{
		id: {
			type: String,
			required: true,
			trim: true,
		},
		usuario: {
			type: usuario,
			required: true,
			trim: true,
		},
		idLiga: {
			type: String,
			required: true,
			trim: true,
		},
		alineacionJugador: {
			type: alineacionJugador,
			required: true,
			trim: true,
		},
		alineacionesJornada: {
			type: [alineacionJugador],
			required: true,
			trim: true,
		},
		valor: {
			type: Number,
			required: true,
		},
		puntos: {
			type: Number,
			required: true,
		},
		dinero: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPlantillaUsuario {
	id: string;
	usuario: IUsuario;
	idLiga: string;
	alineacionJugador: IAlineacionJugador;
	alineacionesJornada: IAlineacionJugador[];
	valor: number;
	puntos: number;
	dinero: number;
}

export const modeloPlantillaUsuario = model<IPlantillaUsuario>(
	"plantillaUsuario",
	plantillaUsuario
);
