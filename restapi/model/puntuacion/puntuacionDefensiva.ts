const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const puntuacionDefensiva = new Schema(
	{
		robos: {
			type: Number,
			required: true,
		},
		tirosBloqueados: {
			type: Number,
			required: true,
		},
		intercepciones: {
			type: Number,
			required: true,
		},
		entradas: {
			type: Number,
			required: true,
		},
		regatesSuperado: {
			type: Number,
			required: true,
		},
		erroresParaDisparo: {
			type: Number,
			required: true,
		},
		golesEnPropia: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionDefensiva {
	robos: number;
	tirosBloqueados: number;
	intercepciones: number;
	entradas: number;
	regatesSuperado: number;
	erroresParaDisparo: number;
	golesEnPropia: number;
}

export const modelPuntuacionDefensiva = model(
	"puntuacionDefensiva",
	puntuacionDefensiva
);
