import { model, Schema } from "mongoose";
import { IJugador, jugador } from "./jugador";

export const transferencia = new Schema<ITransferencia>(
	{
		idComprador: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		idVendedor: {
			type: String,
			required: true,
			trim: true,
		},
		jugador: {
			type: jugador,
			required: true,
			trim: true,
		},
		coste: {
			type: Number,
			required: true,
		},
		estado: {
			type: String,
			required: true,
			trim: true,
			enum: ["ACEPTADA", "RECHAZADA", "ACTIVA"],
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

export interface ITransferencia {
	idComprador: string;
	idVendedor: string;
	jugador: IJugador;
	coste: number;
	estado: string;
	fechaLimite: string;
}

export const modeloTransferencia = model<ITransferencia>(
	"transferencia",
	transferencia
);
