import { model, Schema, Types } from "mongoose";

export interface IAlineacion {
	_id: string;
	jugadoresTitulares: Types.DocumentArray<string>;
	jugadoresSuplentes: Types.DocumentArray<string>;
}

export const alineacion = new Schema<IAlineacion>(
	{
		_id: {
			type: String,
			required: true,
			unique: true,
			trime: true,
		},
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
