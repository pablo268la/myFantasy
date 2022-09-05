const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const jugadorAntiguo = new Schema(
	{
		idEquipoAntiguo: {
			type: String,
			required: true,
			trim: true,
		},
		jornadaTraspaso: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloJugadorAntiguo = model("jugadorAntiguo", jugadorAntiguo);
