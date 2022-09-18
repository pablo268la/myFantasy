import { model, Schema, Types } from "mongoose";

export const plantillaUsuario = new Schema<IPlantillaUsuario>(
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

export interface IPlantillaUsuario {
	_id: string;
	idUsuario: string;
	idLiga: string;
	jugadores: Types.DocumentArray<string>;
	idAlineacion: string;
	idAlineacionesJornada: Types.DocumentArray<string>;
	valor: number;
	puntos: number;
}

plantillaUsuario.index({ _id: 1 }, { unique: true });

export const modeloPlantillaUsuario = model<IPlantillaUsuario>(
	"plantillaUsuario",
	plantillaUsuario
);
