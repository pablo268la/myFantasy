import { model, Schema } from "mongoose";

export const puntuacionTupple = new Schema<IPuntuacionTupple>(
	{
		estadistica: {
			type: Number,
			required: true,
		},
		puntos: {
			type: Number,
			required: true,
		},
	},
	{
		_id: false,
	}
);

export interface IPuntuacionTupple {
	estadistica: number;
	puntos: number;
}

export const modeloPuntuacionTupple = model<IPuntuacionTupple>(
	"puntuacionTupple",
	puntuacionTupple
);
