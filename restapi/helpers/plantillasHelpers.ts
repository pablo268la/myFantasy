import { IJugador, modeloJugador } from "../model/jugador";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { IUsuario, modeloUsuario } from "../model/usuario";

export async function actualizarDatosDeJugadoresDesdeBD(
	propiedades: IPropiedadJugador[],
	mercado: IPropiedadJugador[]
) {
	for (const j of propiedades) {
		const v = mercado.filter((p) => p.jugador.id === j.jugador.id).pop();
		if (v) {
			j.venta = v.venta;
		}
		j.jugador = (await modeloJugador.findOne({ id: j.jugador.id })) as IJugador;
		j.usuario = (await modeloUsuario.findOne({ id: j.usuario.id })) as IUsuario;
	}
}
