import { model, Schema } from "mongoose";

/**
 *   * @openapi
 * 
 * components:
 *   schemas:
 *     IPuntuacionTupple:
 *       type: object
 *       properties:
 *         estadistica:
 *           type: number
 *         puntos:
 *           type: number
 */
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
