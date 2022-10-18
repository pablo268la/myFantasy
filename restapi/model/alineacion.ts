import { model, Schema, Types } from "mongoose";

export interface IAlineacion {
	jugadoresTitulares: Types.DocumentArray<string>;
	jugadoresSuplentes: Types.DocumentArray<string>;
}

export const alineacion = new Schema<IAlineacion>(
	{
		jugadoresTitulares: {
			type: [String],
			required: true,
			trim: true,
		},
		jugadoresSuplentes: {
			type: [String],
			required: true,
			trim: true,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export const modeloAlineacion = model<IAlineacion>("alineacion", alineacion);
