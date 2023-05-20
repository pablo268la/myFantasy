import { IPlantillaUsuario } from "../model/plantillaUsuario";
import { IPropiedadJugador } from "../model/propiedadJugador";

export function quitarJugadorDePlantilla(
	propiedadJugadorVenta: IPropiedadJugador | null,
	plantilla: IPlantillaUsuario,
	idJugadorAQuitar: string
) {
	switch (propiedadJugadorVenta?.jugador.posicion) {
		case "Portero":
			plantilla.alineacionJugador.porteros =
				plantilla.alineacionJugador.porteros.filter(
					(j) => j.jugador.id !== idJugadorAQuitar
				);
			break;
		case "Defensa":
			plantilla.alineacionJugador.defensas =
				plantilla.alineacionJugador.defensas.filter(
					(j) => j.jugador.id !== idJugadorAQuitar
				);
			break;
		case "Mediocentro":
			plantilla.alineacionJugador.medios =
				plantilla.alineacionJugador.medios.filter(
					(j) => j.jugador.id !== idJugadorAQuitar
				);
			break;
		case "Delantero":
			plantilla.alineacionJugador.delanteros =
				plantilla.alineacionJugador.delanteros.filter(
					(j) => j.jugador.id !== idJugadorAQuitar
				);
			break;
	}
}

export function añadirJugadorAPlantilla(
	propiedadJugadorVenta: IPropiedadJugador | null,
	plantilla: IPlantillaUsuario
) {
	switch (propiedadJugadorVenta?.jugador.posicion) {
		case "Portero":
			plantilla.alineacionJugador.porteros.push(propiedadJugadorVenta);
			break;
		case "Defensa":
			plantilla.alineacionJugador.defensas.push(propiedadJugadorVenta);
			break;
		case "Mediocentro":
			plantilla.alineacionJugador.medios.push(propiedadJugadorVenta);
			break;
		case "Delantero":
			plantilla.alineacionJugador.delanteros.push(propiedadJugadorVenta);
			break;
	}
}
