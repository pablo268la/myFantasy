
const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const alineacionJugador = new Schema(
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
		jugadores: {
			type: [String],
			required: true,
			trim: true,
		},
		formacion: {
			type: String,
			required: true,
			trim: true,
			enum: [
				"5-4-1",
				"5-3-2",
				"5-2-3",
				"4-5-1",
				"4-4-2",
				"4-3-3",
				"3-5-2",
				"3-4-3",
			],
		},
		guardadoEn: {
			type: String,
			required: true,
			trim: true,
		},
		idLiga: {
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

alineacionJugador.index({ _id: 1 }, { unique: true });

export const modeloAlineacionJugador = model("alineacionJugador", alineacionJugador);
