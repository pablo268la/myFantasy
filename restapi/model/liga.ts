import { propiedadJugador } from "./propiedadJugador";

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const liga = new Schema(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		idUsuarios: {
			type: [String],
			required: true,
			trim: true,
		},
		propiedadJugadores: {
			type: [propiedadJugador],
			required: true,
			trim: true,
		},
		enlaceInvitacion: {
			type: String,
			required: true,
			trim: true,
		},
		configuracion: {
			type: String,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

liga.index({ _id: 1 }, { unique: true });

export const modeloLiga = model("liga", liga);