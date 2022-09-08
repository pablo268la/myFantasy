import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

export const puntuacionOfensiva = new Schema<IPuntuacionOfensiva>(
	{
		tirosPuerta: {
			type: puntuacionTupple,
			required: true,
		},
		tirosFuera: {
			type: puntuacionTupple,
			required: true,
		},
		tirosBloqueados: {
			type: puntuacionTupple,
			required: true,
		},
		regatesIntentados: {
			type: puntuacionTupple,
			required: true,
		},
		regatesCompletados: {
			type: puntuacionTupple,
			required: true,
		},
		tirosAlPalo: {
			type: puntuacionTupple,
			required: true,
		},
		ocasionClaraFallada: {
			type: puntuacionTupple,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionOfensiva {
	tirosPuerta: IPuntuacionTupple;
	tirosFuera: IPuntuacionTupple;
	tirosBloqueados: IPuntuacionTupple;
	regatesIntentados: IPuntuacionTupple;
	regatesCompletados: IPuntuacionTupple;
	tirosAlPalo: IPuntuacionTupple;
	ocasionClaraFallada: IPuntuacionTupple;
}

export const modelPuntuacionOfensiva = model<IPuntuacionOfensiva>(
	"puntuacionOfensiva",
	puntuacionOfensiva
);
