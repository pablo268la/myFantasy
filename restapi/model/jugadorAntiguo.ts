import { model, Schema } from "mongoose";
import { equipo, IEquipo } from "./equipo";

export interface IJugadorAntiguo {
	equipo: IEquipo;
	jornadaTraspaso: number;
}


/**
 * @openapi
 * components:
 *  schemas:
 *   JugadorAntiguo:
 *    type: object
 *    properties:
 *     equipo:
 *      $ref: '#/components/schemas/Equipo'
 *     jornadaTraspaso:
 *      type: number
 */

export const jugadorAntiguo = new Schema<IJugadorAntiguo>(
	{
		equipo: {
			type: equipo,
			required: true,
			trim: true,
		},
		jornadaTraspaso: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloJugadorAntiguo = model<IJugadorAntiguo>(
	"jugadorAntiguo",
	jugadorAntiguo
);
