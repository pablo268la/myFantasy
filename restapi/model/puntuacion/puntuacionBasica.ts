import { model, Schema } from "mongoose";

export const puntuacionBasica = new Schema<IPuntuacionBasica>(
	{
		minutos: {
			type: Number,
			required: true,
		},
		goles: {
			type: Number,
			required: true,
		},
		asistencias: {
			type: Number,
			required: true,
		},
		valoracion: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionBasica {
	minutos: number;
	goles: number;
	asistencias: number;
	valoracion: number;
}

export const modelPuntuacionBasica = model<IPuntuacionBasica>(
	"puntuacionBasica",
	puntuacionBasica
);
