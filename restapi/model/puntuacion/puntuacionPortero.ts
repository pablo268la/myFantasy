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
		salidasTotales: {
			type: puntuacionTupple,
			required: true,
		},
		salidasCompletadas: {
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
	salidasTotales: IPuntuacionTupple;
	salidasCompletadas: IPuntuacionTupple;
	highClaim: IPuntuacionTupple;
	paradasArea: IPuntuacionTupple;
}

export const modelPuntuacionPortero = model<IPuntuacionPortero>(
	"puntuacionPortero",
	puntuacionPortero
);
