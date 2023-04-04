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
				"Asistencia",
				"Gol en propia puerta",
				"Tarjeta Amarilla",
				"Tarjeta Roja",
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
}

export const modelEventoPartido = model<IEventoPartido>(
	"eventoPartido",
	eventoPartido
);
