
const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const equipoUsuario = new Schema(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		idUsuario: {
			type: String,
			required: true,
			trim: true,
		},
		idLiga: {
			type: String,
			required: true,
			trim: true,
		},
		jugadores: {
			type: [String],
			required: true,
			trim: true,
		},
		idAlineacion: {
			type: String,
			required: true,
			trim: true,
		},
		idAlineacionesJornada: {
			type: [String],
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
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IEquipoUsuario {
	_id: string;
	idUsuario: string;
	idLiga: string;
	jugadores: string[];
	idAlineacion: string;
	idAlineacionesJornada: string[];
	valor: number;
	puntos: number;
}

equipoUsuario.index({ _id: 1 }, { unique: true });

export const modeloEquipoUsuario = model("equipoUsuario", equipoUsuario);
