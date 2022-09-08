import { model, Schema, Types } from "mongoose";

export const alineacionJugador = new Schema<IAlineacionJugador>(
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

export interface IAlineacionJugador {
	_id: string;
	idUsuario: string;
	jugadores: Types.DocumentArray<string>;
	formacion: string;
	guardadoEn: string;
	idLiga: string;
}

alineacionJugador.index({ _id: 1 }, { unique: true });

export const modeloAlineacionJugador = model<IAlineacionJugador>(
	"alineacionJugador",
	alineacionJugador
);
