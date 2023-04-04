import { apiEndPoint } from "../helpers/constants";
import { Equipo, Partido, PuntuacionJugador } from "../shared/sharedTypes";

export async function getPartidos(): Promise<Partido[]> {
	let response = await fetch(apiEndPoint + "/partidos");
	return response.json();
}

export async function getPartido(id: number): Promise<Partido> {
	let response = await fetch(apiEndPoint + "/partidos/" + id);
	return response.json();
}

export async function getPartidosByJornada(
	jornada: number
): Promise<Partido[]> {
	let response = await fetch(apiEndPoint + "/partidos/jornada/" + jornada);
	return response.json();
}

export async function getPartidosByEquipo(equipo: Equipo): Promise<Partido[]> {
	let response = await fetch(apiEndPoint + "/partidos/equipo/" + equipo._id);
	return response.json();
}

export async function getPuntuacionesPartido(
	idPartido: string
): Promise<PuntuacionJugador[]> {
	let response = await fetch(
		apiEndPoint + "/partidos/puntuaciones/" + idPartido
	);

	/*	fetch(
		"https://api.sofascore.com/api/v1/event/10408563/player/39182/statistics"
	).then((res) => res.json().then((r) => console.log(r)));*/

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
	return response.json();
}
