import { model, Schema } from "mongoose";
import { IPlantillaUsuario, plantillaUsuario } from "./plantillaUsuario";
import { IPropiedadJugador, propiedadJugador } from "./propiedadJugador";

/**
 * @openapi
 * components:
 *  schemas:
 *   Liga:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *     nombre:
 *      type: string
 *     plantillasUsuarios:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/PlantillaUsuario'
 *     propiedadJugadores:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/PropiedadJugador'
 *     enlaceInvitacion:
 *      type: string
 *     maxJugadores:
 *      type: number
 *     mercado:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/PropiedadJugador'
 *     configuracion:
 *      type: string
 */

export const liga = new Schema<ILiga>(
	{
		id: {
			type: String,
			required: true,
			trim: true,
			
		},
		nombre: {
			type: String,
			required: true,
			trim: true,
		},
		plantillasUsuarios: {
			type: [plantillaUsuario],
			required: true,
			trim: true,
		},
		propiedadJugadores: {
			type: [propiedadJugador],
			required: true,
			trim: true,
		},
		enlaceInvitacion: {
			type: String,
			required: true,
			trim: true,
		},
		maxJugadores: {
			type: Number,
			required: true,
		},
		mercado: {
			type: [propiedadJugador],
			required: true,
		},
		configuracion: {
			type: String,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface ILiga {
	id: string;
	nombre: string;
	plantillasUsuarios: IPlantillaUsuario[];
	propiedadJugadores: IPropiedadJugador[];
	enlaceInvitacion: string;
	maxJugadores: number;
	mercado: IPropiedadJugador[];
	configuracion?: string;
}

export const modeloLiga = model<ILiga>("liga", liga);
