import { apiEndPoint } from "../helpers/constants";
import { Jugador, PuntuacionJugador } from "../shared/sharedTypes";

export async function getPuntuacionJugador(
	jugador: Jugador
): Promise<PuntuacionJugador[]> {
	let response = await fetch(apiEndPoint + "/puntuaciones/" + jugador._id);
	return response.json();
}

export async function guardarPuntuacionJugador(
	puntuacion: PuntuacionJugador
): Promise<PuntuacionJugador> {
	let response = await fetch(apiEndPoint + "/puntuaciones", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(puntuacion),
	});
	return response.json();
}
