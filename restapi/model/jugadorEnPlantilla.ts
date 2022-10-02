import { model, Schema } from "mongoose";

export interface IJugadorEnPlantilla {
	idJugador: string;
	enPlantilla: boolean;
}

export const jugadorEnPlantilla = new Schema<IJugadorEnPlantilla>(
	{
		idJugador: {
			type: String,
			required: true,
			unique: true,
			trime: true,
		},
		enPlantilla: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloJugadorEnPlantilla = model<IJugadorEnPlantilla>(
	"jugadorEnPlantilla",
	jugadorEnPlantilla
);
