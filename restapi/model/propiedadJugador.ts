import { model, Schema } from "mongoose";
import { IJugador, jugador } from "./jugador";
import { IUsuario, usuario } from "./usuario";
import { IVenta, venta } from "./venta";

/**
 * @openapi
 * components:
 *  schemas:
 *   PropiedadJugador:
 *    type: object
 *    properties:
 *     jugador:
 *      $ref: '#/components/schemas/Jugador'
 *     usuario:
 *      $ref: '#/components/schemas/Usuario'
 *     titular:
 *      type: boolean
 *     venta:
 *      $ref: '#/components/schemas/Venta'
 */

export const propiedadJugador = new Schema<IPropiedadJugador>(
	{
		jugador: {
			type: jugador,
			required: true,
			trim: true,
			
		},
		usuario: {
			type: usuario,
			required: true,
			trim: true,
		},
		titular: {
			type: Boolean,
			required: true,
			default: false,
		},
		venta: {
			type: venta,
			required: false,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPropiedadJugador {
	jugador: IJugador;
	usuario: IUsuario;
	titular: boolean;
	venta: IVenta;
}

export const modeloPropiedadJugador = model<IPropiedadJugador>(
	"propiedadJugador",
	propiedadJugador
);
