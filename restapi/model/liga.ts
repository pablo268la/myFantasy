import { model, Schema, Types } from "mongoose";
import { IPropiedadJugador, propiedadJugador } from "./propiedadJugador";

export const liga = new Schema<ILiga>(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		idUsuarios: {
			type: [String],
			required: true,
			trim: true,
		},
		propiedadJugadores: {
			type: [propiedadJugador],
			required: true,
			trim: true,
		},
		enlaceInvitacion: {
			type: String,
			required: true,
			trim: true,
		},
		configuracion: {
			type: String,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface ILiga {
	_id: string;
	idUsuarios: Types.DocumentArray<string>;
	propiedadJugadores: Types.DocumentArray<IPropiedadJugador>;
	enlaceInvitacion: string;
	configuracion: string;
}

liga.index({ _id: 1 }, { unique: true });

export const modeloLiga = model<ILiga>("liga", liga);
