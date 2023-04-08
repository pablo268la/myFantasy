import { model, Schema } from "mongoose";
import { alineacion, IAlineacion } from "./alineacion";
import { equipo, IEquipo } from "./equipo";
import { eventoPartido, IEventoPartido } from "./eventoPartido";

export interface IPartido {
	_id: string;
	local: IEquipo;
	visitante: IEquipo;
	alineacionLocal: IAlineacion;
	alineacionVisitante: IAlineacion;
	resultadoLocal: number;
	resultadoVisitante: number;
	jornada: number;
	fecha: string;
	linkSofaScore: string;
	estado: string;
	eventos: IEventoPartido[];
}

export const partido = new Schema<IPartido>(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		local: {
			type: equipo,
			required: true,
		},
		visitante: {
			type: equipo,
			required: true,
		},
		alineacionLocal: {
			type: alineacion,
			required: true,
		},
		alineacionVisitante: {
			type: alineacion,
			required: true,
		},
		resultadoLocal: {
			type: Number,
			required: true,
		},
		resultadoVisitante: {
			type: Number,
			required: true,
		},
		jornada: {
			type: Number,
			required: true,
		},
		fecha: {
			type: String,
			required: true,
			trim: true,
		},
		linkSofaScore: {
			type: String,
			required: true,
			trim: true,
		},
		estado: {
			type: String,
			required: true,
			trim: true,
			enum: ["Por jugar", "Finalizado", "En juego", "Cancelado"],
		},
		eventos: {
			type: [eventoPartido],
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloPartido = model<IPartido>("partido", partido);
