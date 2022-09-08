const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const puntuacionPortero = new Schema(
	{
		paradas: {
			type: Number,
			required: true,
		},
		despejes: {
			type: Number,
			required: true,
		},
		salidasTotales: {
			type: Number,
			required: true,
		},
		salidasCompletadas: {
			type: Number,
			required: true,
		},
		highClaim: {
			type: Number,
			required: true,
		},
		paradasArea: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionPortero {
	paradas: number;
	despejes: number;
	salidasTotales: number;
	salidasCompletadas: number;
	highClaim: number;
	paradasArea: number;
}

export const modelPuntuacionPortero = model(
	"puntuacionPortero",
	puntuacionPortero
);
