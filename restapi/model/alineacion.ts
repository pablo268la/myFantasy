import { model, Schema } from "mongoose";
import { IJugador, jugador } from "./jugador";

export interface IAlineacion {
	jugadoresTitulares: IJugador[];
	jugadoresSuplentes: IJugador[];
}

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
