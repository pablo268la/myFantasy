import { model, Schema } from "mongoose";

export interface IJugadorAntiguo {
	idEquipoAntiguo: string;
	jornadaTraspaso: number;
}

export const jugadorAntiguo = new Schema<IJugadorAntiguo>(
	{
		idEquipoAntiguo: {
			type: String,
			required: true,
			trim: true,
		},
		jornadaTraspaso: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloJugadorAntiguo = model<IJugadorAntiguo>(
	"jugadorAntiguo",
	jugadorAntiguo
);
