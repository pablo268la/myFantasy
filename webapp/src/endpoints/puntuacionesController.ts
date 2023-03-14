import { apiEndPoint } from "../helpers/constants";
import { Jugador, PuntuacionJugador } from "../shared/sharedTypes";

export async function getPuntuacionJugador(
	jugador: Jugador
): Promise<PuntuacionJugador[]> {
	let response = await fetch(apiEndPoint + "/puntuaciones/" + jugador._id);
	return response.json();
}
