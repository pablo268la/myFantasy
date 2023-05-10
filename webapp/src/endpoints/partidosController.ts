import { apiEndPoint } from "../helpers/constants";
import { Equipo, Partido, PuntuacionJugador } from "../shared/sharedTypes";

export async function getPartido(id: string): Promise<Partido> {
	let response = await fetch(apiEndPoint + "/partidos/" + id);
	return response.json();
}

export async function getPartidosByJornada(
	jornada: number
): Promise<Partido[]> {
	let response = await fetch(apiEndPoint + "/partidos/jornada/" + jornada);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function getPartidosByEquipo(equipo: Equipo): Promise<Partido[]> {
	let response = await fetch(apiEndPoint + "/partidos/equipo/" + equipo._id);
	//TODO - Usar para mostrar siguiente partido

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function getPuntuacionesPartido(
	idPartido: string
): Promise<PuntuacionJugador[]> {
	let response = await fetch(
		apiEndPoint + "/partidos/puntuaciones/" + idPartido
	);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function updatePartido(partido: Partido): Promise<Partido> {
	let response = await fetch(apiEndPoint + "/partidos/" + partido._id, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(partido),
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}
