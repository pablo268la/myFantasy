import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { Jugador } from "../shared/sharedTypes";
import { doRequest } from "./callBackEnd";

export async function getJugadores(): Promise<Jugador[]> {
	return await doRequest(apiEndPoint + "/jugadores");
}
export async function getJugadoresPorEquipo(
	equipoId: string
): Promise<Jugador[]> {
	return await doRequest(apiEndPoint + "/jugadoresEquipo/" + equipoId);
}

export async function getJugadorById(id: string): Promise<Jugador> {
	return await doRequest(apiEndPoint + "/jugadores/" + id);
}

export async function getJugadoresAntiguos(
	idEquipo: string,
	semanaTraspaao: number
): Promise<Jugador[]> {
	return await doRequest(
		apiEndPoint + "/jugadores/antiguos/" + idEquipo + "/" + semanaTraspaao
	);
}

export async function updateJugador(jugador: Jugador): Promise<Jugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/jugadores/" + jugador.id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify(jugador),
	});
}
