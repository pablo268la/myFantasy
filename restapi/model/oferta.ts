import { model, Schema } from "mongoose";
import { IUsuario, usuario } from "./usuario";

/**
 * @openapi
 * components:
 *  schemas:
 *   Oferta:
 *    type: object
 *    properties:
 *     comprador:
 *      $ref: '#/components/schemas/Usuario'
 *     valorOferta:
 *      type: number
 *     estado:
 *      type: string
 *      enum: ["ACEPTADA", "RECHAZADA", "ACTIVA"]
 *     privada:
 *      type: boolean
 */


export const oferta = new Schema<IOferta>(
	{
		comprador: {
			type: usuario,
			required: true,
		},
		valorOferta: {
			type: Number,
			required: true,
		},
		estado: {
			type: String,
			required: true,
			trim: true,
			enum: ["ACEPTADA", "RECHAZADA", "ACTIVA"],
		},
		privada: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IOferta {
	comprador: IUsuario;
	valorOferta: number;
	estado: string;
	privada: boolean;
}

export const modeloOferta = model<IOferta>("oferta", oferta);
