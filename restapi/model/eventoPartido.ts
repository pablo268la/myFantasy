import { model, Schema } from "mongoose";
import { IJugador, jugador } from "./jugador";

export const eventoPartido = new Schema<IEventoPartido>(
	{
		tipo: {
			type: String,
			required: true,
			trim: true,
			enum: [
				"Gol",
				"Gol en propia puerta",
				"Tarjeta amarilla",
				"Tarjeta roja",
				"Doble amarilla",
				"Cambio",
			],
		},
		minuto: {
			type: Number,
			required: true,
		},
		jugador: {
			type: jugador,
			required: true,
		},
		jugador2: {
			type: jugador,
			required: false,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IEventoPartido {
	tipo: string;
	minuto: number;
	jugador: IJugador;
	jugador2?: IJugador;
}

export const modelEventoPartido = model<IEventoPartido>(
	"eventoPartido",
	eventoPartido
);
