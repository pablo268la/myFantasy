import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

export const puntuacionBasica = new Schema<IPuntuacionBasica>(
	{
		minutos: {
			type: puntuacionTupple,
			required: true,
		},
		goles: {
			type: puntuacionTupple,
			required: true,
		},
		asistencias: {
			type: puntuacionTupple,
			required: true,
		},
		valoracion: {
			type: puntuacionTupple,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionBasica {
	minutos: IPuntuacionTupple;
	goles: IPuntuacionTupple;
	asistencias: IPuntuacionTupple;
	valoracion: IPuntuacionTupple;
}

export const modelPuntuacionBasica = model<IPuntuacionBasica>(
	"puntuacionBasica",
	puntuacionBasica
);
