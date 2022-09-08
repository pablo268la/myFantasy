import { model, Schema } from "mongoose";

import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

export const puntuacionPosesion = new Schema<IPuntuacionPosesion>(
	{
		toquesBalon: {
			type: puntuacionTupple,
			required: true,
		},
		pasesTotales: {
			type: puntuacionTupple,
			required: true,
		},
		pasesCompletados: {
			type: puntuacionTupple,
			required: true,
		},
		pasesClave: {
			type: puntuacionTupple,
			required: true,
		},
		centrosTotales: {
			type: puntuacionTupple,
			required: true,
		},
		centrosCompletados: {
			type: puntuacionTupple,
			required: true,
		},
		pasesLargosTotales: {
			type: puntuacionTupple,
			required: true,
		},
		pasesLargosCompletados: {
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

export interface IPuntuacionPosesion {
	toquesBalon: IPuntuacionTupple;
	pasesTotales: IPuntuacionTupple;
	pasesCompletados: IPuntuacionTupple;
	pasesClave: IPuntuacionTupple;
	centrosTotales: IPuntuacionTupple;
	centrosCompletados: IPuntuacionTupple;
	pasesLargosTotales: IPuntuacionTupple;
	pasesLargosCompletados: IPuntuacionTupple;
}

export const modelPuntuacionPosesion = model<IPuntuacionPosesion>(
	"puntuacionPosesion",
	puntuacionPosesion
);
