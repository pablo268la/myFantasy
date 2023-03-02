import { model, Schema } from "mongoose";
import { IOferta, oferta } from "./oferta";
import {
	IPropiedadJugador,
	propiedadJugador
} from "./propiedadJugador";

export const venta = new Schema<IVenta>(
	{
		jugador: {
			type: propiedadJugador,
			required: true,
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
	jugador: IPropiedadJugador;
	ofertas: IOferta[];
	fechaLimite: string;
}

export const modeloVenta = model<IVenta>("venta", venta);
