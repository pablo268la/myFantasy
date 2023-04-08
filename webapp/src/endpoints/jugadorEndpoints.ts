import { apiEndPoint } from "../helpers/constants";
import { Jugador } from "../shared/sharedTypes";

export async function getJugadores(): Promise<Jugador[]> {
	let response = await fetch(apiEndPoint + "/jugadores");
	return response.json();
}

export async function getJugadoresPorEquipo(
	equipoId: string
): Promise<Jugador[]> {
	let response = await fetch(apiEndPoint + "/jugadoresEquipo/" + equipoId);
	return response.json();
}

export async function getJugadorById(id: string): Promise<Jugador> {
	let response = await fetch(apiEndPoint + "/jugadores/" + id);
	return response.json();
}

export async function getJugadoresAntiguos(
	idEquipo: string,
	semanaTraspaao: number
): Promise<Jugador[]> {
	let response = await fetch(
		apiEndPoint + "/jugadores/antiguos/" + idEquipo + "/" + semanaTraspaao
	);
	return response.json();
}

export async function updateJugador(jugador: Jugador): Promise<Jugador> {
	let response = await fetch(apiEndPoint + "/jugadores/" + jugador._id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(jugador),
	});
	return response.json();
}
