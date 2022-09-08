import { model, Schema } from "mongoose";

export const puntuacionTupple = new Schema<IPuntuacionTupple>(
	{
		estadistica: {
			type: Number,
			required: true,
		},
		puntuacion: {
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
	puntuacion: number;
}

export const modeloPuntuacionTupple = model<IPuntuacionTupple>(
	"puntuacionTupple",
	puntuacionTupple
);
