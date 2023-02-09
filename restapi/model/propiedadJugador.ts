import { model, Schema } from "mongoose";
import { IJugador, jugador } from "./jugador";
import { IUsuario, usuario } from "./usuario";

export const propiedadJugador = new Schema<IPropiedadJugador>(
	{
		jugador: {
			type: jugador,
			required: true,
			trim: true,
			unique: true,
		},
		usuario: {
			type: usuario,
			required: true,
			trim: true,
		},
		titular: {
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

export interface IPropiedadJugador {
	jugador: IJugador;
	usuario: IUsuario;
	titular: boolean;
}

export const modeloPropiedadJugador = model<IPropiedadJugador>(
	"propiedadJugador",
	propiedadJugador
);
