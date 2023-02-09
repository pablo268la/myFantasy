import { model, Schema } from "mongoose";
import { equipo, IEquipo } from "./equipo";
import { IJugadorAntiguo, jugadorAntiguo } from "./jugadorAntiguo";

export interface IJugador {
	_id: string;
	nombre: string;
	slug: string;
	posicion: string;
	equipo: IEquipo;
	valor: number;
	puntos: number;
	estado: string;
	foto: string;
	jugadorAntiguo: IJugadorAntiguo;
	fantasyMarcaId: string;
}

export const jugador = new Schema<IJugador>(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
		},
		nombre: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			trim: true,
		},
		posicion: {
			type: String,
			required: true,
			trim: true,
			enum: ["Portero", "Defensa", "Mediocentro", "Delantero", "Sin asignar"],
		},
		equipo: {
			type: equipo,
			required: true,
			trim: true,
		},
		valor: {
			type: Number,
			required: true,
		},
		puntos: {
			type: Number,
			required: true,
		},
		estado: {
			type: String,
			required: true,
			trim: true,
			enum: ["Disponible", "Dudoso", "Lesionado", "No disponible"],
		},
		foto: {
			type: String,
			required: false,
			trim: true,
		},
		jugadorAntiguo: {
			type: jugadorAntiguo,
		},
		fantasyMarcaId: {
			type: String,
			required: false,
			trim: true,
			unqiue: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

jugador.index({ _id: 1 }, { unique: true });

export const modeloJugador = model<IJugador>("jugador", jugador);
