import { model, Schema, Types } from "mongoose";
import { IJugadorAntiguo, jugadorAntiguo } from "./jugadorAntiguo";
import {
	IPuntuacionJugador,
	puntuacionJugador
} from "./puntuacion/puntuacionJugador";

export interface IJugador {
	_id: string;
	nombre: string;
	slug: string;
	posicion: string;
	idEquipo: string;
	valor: number;
	puntos: number;
	estado: string;
	foto: string;
	jugadorAntiguo: IJugadorAntiguo;
	puntuaciones: Types.DocumentArray<IPuntuacionJugador>;
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
		idEquipo: {
			type: String,
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
		puntuaciones: {
			type: [puntuacionJugador],
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

jugador.index({ _id: 1 }, { unique: true });

export const modeloJugador = model<IJugador>("jugador", jugador);
