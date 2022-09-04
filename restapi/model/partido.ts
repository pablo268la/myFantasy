import { alineacion } from "./alineacion";

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const partido = new Schema(
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
			type: [alineacion],
			required: true,
		},
		alineacionVisitante: {
			type: [alineacion],
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

partido.index({ _id: 1 }, { unique: true });

export const modeloPartido = model("partido", partido);
