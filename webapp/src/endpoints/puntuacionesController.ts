import { apiEndPoint } from "../helpers/constants";
import { PuntuacionJugador } from "../shared/sharedTypes";

export async function getPuntuacionJugador(
	jugadorId: string
): Promise<PuntuacionJugador[]> {
	let response = await fetch(apiEndPoint + "/puntuaciones/" + jugadorId);
	return response.json();
}

export async function getPuntuacionJugadorSemana(
	jugadorId: string,
	semana: number
): Promise<PuntuacionJugador> {
	let response = await fetch(
		apiEndPoint + "/puntuaciones/" + jugadorId + "/" + semana
	);
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
