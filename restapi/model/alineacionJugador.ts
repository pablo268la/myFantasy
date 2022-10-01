import { model, Schema, Types } from "mongoose";

export const alineacionJugador = new Schema<IAlineacionJugador>(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		portero: {
			type: String,
			required: true,
			trim: true,
		},
		defensas: {
			type: [String],
			required: true,
			trim: true,
		},
		medios: {
			type: [String],
			required: true,
			trim: true,
		},
		delanteros: {
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

export interface IAlineacionJugador {
	_id: string;
	portero: string;
	defensas: Types.DocumentArray<string>;
	medios: Types.DocumentArray<string>;
	delanteros: Types.DocumentArray<string>;
	formacion: string;
}

alineacionJugador.index({ _id: 1 }, { unique: true });

export const modeloAlineacionJugador = model<IAlineacionJugador>(
	"alineacionJugador",
	alineacionJugador
);
