import { model, Schema } from "mongoose";

export const entrenador = new Schema<IEntrenador>(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		idEquipo: {
			type: String,
			required: true,
			trim: true,
		},
		nombre: {
			type: String,
			required: true,
			trim: true,
		},
		puntos: {
			type: Number,
			required: true,
		},
		formacionFav: {
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
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IEntrenador {
	_id: string;
	idEquipo: string;
	nombre: string;
	puntos: number;
	formacionFav: string;
}

entrenador.index({ _id: 1 }, { unique: true });

export const modeloEntrenador = model<IEntrenador>("entrenador", entrenador);
