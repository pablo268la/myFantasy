import { model, Schema } from "mongoose";
import { alineacion, IAlineacion } from "./alineacion";

export interface IPartido {
	_id: string;
	idLocal: string;
	idVisitante: string;
	alineacionLocal: IAlineacion;
	alineacionVisitante: IAlineacion;
	resultadoLocal: number;
	resultadoVisitante: number;
	jornada: number;
	fecha: string;
	linkSofaScore: string;
	estado: string;
}

export const partido = new Schema<IPartido>(
	{
		_id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		idLocal: {
			type: String,
			required: true,
			trim: true,
		},
		idVisitante: {
			type: String,
			required: true,
			trim: true,
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
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloPartido = model<IPartido>("partido", partido);
