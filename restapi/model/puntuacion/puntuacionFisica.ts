import { model, Schema } from "mongoose";

export const puntuacionFisica = new Schema<IPuntuacionFisica>(
	{
		duelosGanados: {
			type: Number,
			required: true,
		},
		duelosPerdidos: {
			type: Number,
			required: true,
		},
		duelosAereosGanados: {
			type: Number,
			required: true,
		},
		duelosAereosPerdidos: {
			type: Number,
			required: true,
		},
		posesionPerdida: {
			type: Number,
			required: true,
		},
		faltasCometidas: {
			type: Number,
			required: true,
		},
		faltasRecibidas: {
			type: Number,
			required: true,
		},
		fuerasDeJuego: {
			type: Number,
			required: true,
		},
		tarjetaAmarilla: {
			type: Boolean,
			required: true,
		},
		tarjetaRoja: {
			type: Boolean,
			required: true,
		},
		dobleTarjetaAmarilla: {
			type: Boolean,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IPuntuacionFisica {
	duelosGanados: number;
	duelosPerdidos: number;
	duelosAereosGanados: number;
	duelosAereosPerdidos: number;
	posesionPerdida: number;
	faltasCometidas: number;
	faltasRecibidas: number;
	fuerasDeJuego: number;
	tarjetaAmarilla: boolean;
	tarjetaRoja: boolean;
	dobleTarjetaAmarilla: boolean;
}

export const modelPuntuacionFisica = model<IPuntuacionFisica>(
	"puntuacionFisica",
	puntuacionFisica
);
