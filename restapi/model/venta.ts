import { model, Schema } from "mongoose";
import { IOferta, oferta } from "./oferta";

/**
 * @openapi
 * components:
 *  schemas:
 *   Venta:
 *    type: object
 *    properties:
 *     enVenta:
 *      type: boolean
 *     ofertas:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/Oferta'
 *     fechaLimite:
 *      type: string
 *
 */

export const venta = new Schema<IVenta>(
	{
		enVenta: {
			type: Boolean,
			required: true,
			default: false,
		},
		ofertas: {
			type: [oferta],
			required: true,
		},
		fechaLimite: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IVenta {
	enVenta: boolean;
	ofertas: IOferta[];
	fechaLimite: string;
}

export const modeloVenta = model<IVenta>("venta", venta);
