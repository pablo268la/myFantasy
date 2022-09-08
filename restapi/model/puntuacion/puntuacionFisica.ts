import { model, Schema } from "mongoose";
import { IPuntuacionTupple, puntuacionTupple } from "./puntuacionTupple";

export const puntuacionFisica = new Schema<IPuntuacionFisica>(
	{
		duelosGanados: {
			type: puntuacionTupple,
			required: true,
		},
		duelosPerdidos: {
			type: puntuacionTupple,
			required: true,
		},
		duelosAereosGanados: {
			type: puntuacionTupple,
			required: true,
		},
		duelosAereosPerdidos: {
			type: puntuacionTupple,
			required: true,
		},
		posesionPerdida: {
			type: puntuacionTupple,
			required: true,
		},
		faltasCometidas: {
			type: puntuacionTupple,
			required: true,
		},
		faltasRecibidas: {
			type: puntuacionTupple,
			required: true,
		},
		fuerasDeJuego: {
			type: puntuacionTupple,
			required: true,
		},
		tarjetaAmarilla: {
			type: puntuacionTupple,
			required: true,
		},
		tarjetaRoja: {
			type: puntuacionTupple,
			required: true,
		},
		dobleTarjetaAmarilla: {
			type: puntuacionTupple,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionFisica {
	duelosGanados: IPuntuacionTupple;
	duelosPerdidos: IPuntuacionTupple;
	duelosAereosGanados: IPuntuacionTupple;
	duelosAereosPerdidos: IPuntuacionTupple;
	posesionPerdida: IPuntuacionTupple;
	faltasCometidas: IPuntuacionTupple;
	faltasRecibidas: IPuntuacionTupple;
	fuerasDeJuego: IPuntuacionTupple;
	tarjetaAmarilla: IPuntuacionTupple;
	tarjetaRoja: IPuntuacionTupple;
	dobleTarjetaAmarilla: IPuntuacionTupple;
}

export const modelPuntuacionFisica = model<IPuntuacionFisica>(
	"puntuacionFisica",
	puntuacionFisica
);
