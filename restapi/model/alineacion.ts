
const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const alineacion = new Schema(
	{
		jugadoresTitulares: {
			type: [String],
			required: true,
			trim: true,
		},
		jugadoresSuplentes: {
			type: [String],
			required: true,
			trim: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloAlineacion = model("alineacion", alineacion);
