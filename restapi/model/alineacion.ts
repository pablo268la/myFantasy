import { model, Schema } from "mongoose";
import { IJugador, jugador } from "./jugador";

export interface IAlineacion {
	jugadoresTitulares: IJugador[];
	jugadoresSuplentes: IJugador[];
}
/**
 * @openapi
 * components:
 *  schemas:
 *   Alineacion:
 *    type: object
 *    properties:
 *     jugadoresTitulares:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/Jugador'
 *     jugadoresSuplentes:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/Jugador'
 * 
 */


export const alineacion = new Schema<IAlineacion>(
	{
		jugadoresTitulares: {
			type: [jugador],
			required: true,
			trim: true,
		},
		jugadoresSuplentes: {
			type: [jugador],
			required: true,
			trim: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloAlineacion = model<IAlineacion>("alineacion", alineacion);
