import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

export const puntuacionPortero = new Schema<IPuntuacionPortero>(
	{
		paradas: {
			type: puntuacionTupple,
			required: true,
		},
		despejes: {
			type: puntuacionTupple,
			required: true,
		},
		salidas: {
			type: puntuacionTupple,
			required: true,
		},
		highClaim: {
			type: puntuacionTupple,
			required: true,
		},
		paradasArea: {
			type: puntuacionTupple,
			required: true,
		},
		penaltiesParados: {
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

export interface IPuntuacionPortero {
	paradas: IPuntuacionTupple;
	despejes: IPuntuacionTupple;
	salidas: IPuntuacionTupple;
	highClaim: IPuntuacionTupple;
	paradasArea: IPuntuacionTupple;
	penaltiesParados: IPuntuacionTupple;
}

export const modelPuntuacionPortero = model<IPuntuacionPortero>(
	"puntuacionPortero",
	puntuacionPortero
);
