import { model, Schema } from "mongoose";

import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

export const puntuacionCalculable = new Schema<IPuntuacionCalculable>(
	{
		golesRecibidos: {
			type: puntuacionTupple,
			required: true,
		},
		tarjetasAmarilla: {
			type: puntuacionTupple,
			required: true,
		},
		tarjetasRoja: {
			type: puntuacionTupple,
			required: true,
		},
		dobleAmarilla: {
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

export interface IPuntuacionCalculable {
	golesRecibidos: IPuntuacionTupple;
	tarjetasAmarilla: IPuntuacionTupple;
	tarjetasRoja: IPuntuacionTupple;
	dobleAmarilla: IPuntuacionTupple;
}

export const modelPuntuacionCalculable = model<IPuntuacionCalculable>(
	"puntuacionCalculable",
	puntuacionCalculable
);
