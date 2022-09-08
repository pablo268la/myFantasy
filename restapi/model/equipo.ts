const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const equipo = new Schema(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
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
		shortName: {
			type: String,
			required: true,
			trim: true,
		},
		escudo: {
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

export interface IEquipo {
	_id: string;
	nombre: string;
	slug: string;
	shortName: string;
	escudo: string;
}

equipo.index({ _id: 1 }, { unique: true });

export const modeloEquipo = model("equipo", equipo);
