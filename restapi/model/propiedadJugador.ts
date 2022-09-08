import { model, Schema } from "mongoose";

export const propiedadJugador = new Schema<IPropiedadJugador>(
	{
		idJugador: {
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
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPropiedadJugador {
	idJugador: string;
	idUsuario: string;
	idLiga: string;
}

export const modeloPropiedadJugador = model<IPropiedadJugador>(
	"propiedadJugador",
	propiedadJugador
);
