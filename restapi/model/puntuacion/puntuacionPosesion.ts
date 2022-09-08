import { model, Schema } from "mongoose";

export const puntuacionPosesion = new Schema<IPuntuacionPosesion>(
	{
		toquesBalon: {
			type: Number,
			required: true,
		},
		pasesTotales: {
			type: Number,
			required: true,
		},
		pasesCompletados: {
			type: Number,
			required: true,
		},
		pasesClave: {
			type: Number,
			required: true,
		},
		centrosTotales: {
			type: Number,
			required: true,
		},
		centrosCompletados: {
			type: Number,
			required: true,
		},
		pasesLargosTotales: {
			type: Number,
			required: true,
		},
		pasesLargosCompletados: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionPosesion {
	toquesBalon: number;
	pasesTotales: number;
	pasesCompletados: number;
	pasesClave: number;
	centrosTotales: number;
	centrosCompletados: number;
	pasesLargosTotales: number;
	pasesLargosCompletados: number;
}

export const modelPuntuacionPosesion = model<IPuntuacionPosesion>(
	"puntuacionPosesion",
	puntuacionPosesion
);
