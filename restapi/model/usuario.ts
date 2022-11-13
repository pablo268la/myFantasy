import { model, Schema, Types } from "mongoose";

export const usuario = new Schema<IUsuario>(
	{
		nombre: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		contraseña: {
			type: String,
			required: true,
			trim: true,
		},
		ligas: {
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

export interface IUsuario {
	nombre: string;
	email: string;
	contraseña: string;
	ligas: Types.DocumentArray<string>;
}

export const modeloUsuario = model<IUsuario>("usuario", usuario);
