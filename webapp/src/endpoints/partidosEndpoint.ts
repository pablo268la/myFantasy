import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { Equipo, Partido, PuntuacionJugador } from "../shared/sharedTypes";
import { doRequest } from "./callBackEnd";

export async function getPartido(id: string): Promise<Partido> {
	return await doRequest(apiEndPoint + "/partidos/" + id);
}

export async function getPartidosByJornada(
	jornada: number
): Promise<Partido[]> {
	return await doRequest(apiEndPoint + "/partidos/jornada/" + jornada);
}

export async function getPartidosByEquipo(equipo: Equipo): Promise<Partido[]> {
	return await doRequest(apiEndPoint + "/partidos/equipo/" + equipo.id);
	//TODO - Usar para mostrar siguiente partido
}

export async function getPuntuacionesPartido(
	idPartido: string
): Promise<PuntuacionJugador[]> {
	return await doRequest(apiEndPoint + "/partidos/puntuaciones/" + idPartido);
}

export async function updatePartido(partido: Partido): Promise<Partido> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/partidos/" + partido.id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify(partido),
	});
}
