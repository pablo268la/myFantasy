import { model, Schema } from "mongoose";
import { IJugadorEnPlantilla, jugadorEnPlantilla } from "./jugadorEnPlantilla";

export const alineacionJugador = new Schema<IAlineacionJugador>(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		porteros: {
			type: [jugadorEnPlantilla],
			required: true,
			trim: true,
		},
		defensas: {
			type: [jugadorEnPlantilla],
			required: true,
			trim: true,
		},
		medios: {
			type: [jugadorEnPlantilla],
			required: true,
			trim: true,
		},
		delanteros: {
			type: [jugadorEnPlantilla],
			required: true,
			trim: true,
		},
		formacion: {
			type: String,
			required: true,
			trim: true,
			enum: ["5-4-1", "5-3-2", "4-5-1", "4-4-2", "4-3-3", "3-5-2", "3-4-3"],
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IAlineacionJugador {
	_id: string;
	porteros: IJugadorEnPlantilla[];
	defensas: IJugadorEnPlantilla[];
	medios: IJugadorEnPlantilla[];
	delanteros: IJugadorEnPlantilla[];
	formacion: string;
}

alineacionJugador.index({ _id: 1 }, { unique: true });

export const modeloAlineacionJugador = model<IAlineacionJugador>(
	"alineacionJugador",
	alineacionJugador
);
