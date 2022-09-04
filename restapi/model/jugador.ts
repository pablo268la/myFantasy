const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const jugador = new Schema(
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
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

jugador.index({ _id: 1 }, { unique: true });

export const modeloJugador = model("jugador", jugador);
