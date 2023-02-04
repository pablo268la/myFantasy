import { model, Schema } from "mongoose";
import { IPropiedadJugador, propiedadJugador } from "./propiedadJugador";
import { IUsuario, usuario } from "./usuario";

export const liga = new Schema<ILiga>(
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
		usuarios: {
			type: [usuario],
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
		maxJugadores: {
			type: Number,
			required: true,
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
	nombre: string;
	usuarios: IUsuario[];
	propiedadJugadores: IPropiedadJugador[];
	enlaceInvitacion: string;
	maxJugadores: number;
	configuracion: string;
}

liga.index({ _id: 1 }, { unique: true });

export const modeloLiga = model<ILiga>("liga", liga);
