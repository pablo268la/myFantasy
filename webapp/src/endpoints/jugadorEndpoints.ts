import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { Jugador } from "../shared/sharedTypes";

export async function getJugadores(): Promise<Jugador[]> {
	let response = await fetch(apiEndPoint + "/jugadores");
	return response.json();
}
export async function getJugadoresPorEquipo(
	equipoId: string
): Promise<Jugador[]> {
	let response = await fetch(apiEndPoint + "/jugadoresEquipo/" + equipoId);
	
	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function getJugadorById(id: string): Promise<Jugador> {
	let response = await fetch(apiEndPoint + "/jugadores/" + id);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function getJugadoresAntiguos(
	idEquipo: string,
	semanaTraspaao: number
): Promise<Jugador[]> {
	let response = await fetch(
		apiEndPoint + "/jugadores/antiguos/" + idEquipo + "/" + semanaTraspaao
	);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function updateJugador(jugador: Jugador): Promise<Jugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/jugadores/" + jugador.id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify(jugador),
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}
