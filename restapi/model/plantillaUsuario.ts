import { model, Schema } from "mongoose";
import { alineacionJugador, IAlineacionJugador } from "./alineacionJugador";
import { IUsuario, usuario } from "./usuario";

export const plantillaUsuario = new Schema<IPlantillaUsuario>(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		usuario: {
			type: usuario,
			required: true,
			trim: true,
		},
		idLiga: {
			type: String,
			required: true,
			trim: true,
		},
		alineacionJugador: {
			type: alineacionJugador,
			required: true,
			trim: true,
		},
		alineacionesJornada: {
			type: [alineacionJugador],
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
		dinero: {
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
	usuario: IUsuario;
	idLiga: string;
	alineacionJugador: IAlineacionJugador;
	alineacionesJornada: IAlineacionJugador[];
	valor: number;
	puntos: number;
	dinero: number;
}

plantillaUsuario.index({ _id: 1 }, { unique: true });

export const modeloPlantillaUsuario = model<IPlantillaUsuario>(
	"plantillaUsuario",
	plantillaUsuario
);
