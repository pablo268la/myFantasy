import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { PuntuacionJugador } from "../shared/sharedTypes";
import { doRequest } from "./callBackEnd";

export async function getPuntuacionJugador(
	jugadorId: string
): Promise<PuntuacionJugador[]> {
	return await doRequest(apiEndPoint + "/puntuaciones/" + jugadorId);
}

export async function getPuntuacionJugadorSemana(
	jugadorId: string,
	semana: number
): Promise<PuntuacionJugador> {
	return await doRequest(
		apiEndPoint + "/puntuaciones/" + jugadorId + "/" + semana
	);
}

export async function guardarPuntuacionJugador(
	puntuacion: PuntuacionJugador
): Promise<PuntuacionJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/puntuaciones", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify(puntuacion),
	});
}
