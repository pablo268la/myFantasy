import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

export const puntuacionDefensiva = new Schema<IPuntuacionDefensiva>(
	{
		robos: {
			type: puntuacionTupple,
			required: true,
		},
		tirosBloqueados: {
			type: puntuacionTupple,
			required: true,
		},
		intercepciones: {
			type: puntuacionTupple,
			required: true,
		},
		entradas: {
			type: puntuacionTupple,
			required: true,
		},
		regatesSuperado: {
			type: puntuacionTupple,
			required: true,
		},
		erroresParaDisparo: {
			type: puntuacionTupple,
			required: true,
		},
		golesEnPropia: {
			type: puntuacionTupple,
			required: true,
		},
	},
	{
		_id: false,
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionDefensiva {
	robos: IPuntuacionTupple;
	tirosBloqueados: IPuntuacionTupple;
	intercepciones: IPuntuacionTupple;
	entradas: IPuntuacionTupple;
	regatesSuperado: IPuntuacionTupple;
	erroresParaDisparo: IPuntuacionTupple;
	golesEnPropia: IPuntuacionTupple;
}

export const modelPuntuacionDefensiva = model<IPuntuacionDefensiva>(
	"puntuacionDefensiva",
	puntuacionDefensiva
);
