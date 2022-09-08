const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const usuario = new Schema(
	{
		_id: {
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
		apellido: {
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
	_id: string;
	nombre: string;
	apellido: string;
	email: string;
	contraseña: string;
	ligas: string[];
}

usuario.index({ _id: 1 }, { unique: true });

export const modeloUsuario = model("usuario", usuario);
