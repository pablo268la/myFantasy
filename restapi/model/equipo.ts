import { model, Schema } from "mongoose";

export const equipo = new Schema<IEquipo>(
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

export const modeloEquipo = model<IEquipo>("equipo", equipo);
