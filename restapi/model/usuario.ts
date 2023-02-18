import { model, Schema } from "mongoose";

export const usuario = new Schema<IUsuario>(
	{
		id: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		nombre: {
			type: String,
			required: true,
			trim: true,
		},
		usuario: {
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
		admin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

export interface IUsuario {
	id: string;
	nombre: string;
	usuario: string;
	email: string;
	contraseña: string;
	ligas: string[];
	admin: boolean;
}

export const modeloUsuario = model<IUsuario>("usuario", usuario);
