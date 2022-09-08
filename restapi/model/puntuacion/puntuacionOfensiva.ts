const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const puntuacionOfensiva = new Schema(
	{
		tirosPuerta: {
			type: Number,
			required: true,
		},
		tirosFuera: {
			type: Number,
			required: true,
		},
		tirosBloqueados: {
			type: Number,
			required: true,
		},
		regatesIntentados: {
			type: Number,
			required: true,
		},
		regatesCompletados: {
			type: Number,
			required: true,
		},
		tirosAlPalo: {
			type: Number,
			required: true,
		},
		ocasionClaraFallada: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionOfensiva {
	tirosPuerta: number;
	tirosFuera: number;
	tirosBloqueados: number;
	regatesIntentados: number;
	regatesCompletados: number;
	tirosAlPalo: number;
	ocasionClaraFallada: number;
}

export const modelPuntuacionOfensiva = model(
	"puntuacionOfensiva",
	puntuacionOfensiva
);
