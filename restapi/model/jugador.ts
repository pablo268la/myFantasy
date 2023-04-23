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

/**
 * @openapi
 * components:
 *  schemas:
 *   Jugador:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     nombre:
 *      type: string
 *     slug:
 *      type: string
 *     posicion:
 *      type: string
 *      enum: ["Portero", "Defensa", "Mediocentro", "Delantero", "Sin asignar"]
 *     equipo:
 *      $ref: '#/components/schemas/Equipo'
 *     valor:
 *      type: number
 *     puntos:
 *      type: number
 *     estado:
 *      type: string
 *      enum: ["Disponible", "Dudoso", "Lesionado", "No disponible"]
 *     foto:
 *      type: string
 *     jugadorAntiguo:
 *      $ref: '#/components/schemas/JugadorAntiguo'
 *     fantasyMarcaId:
 *      type: string
 */
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
			required: false,
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
