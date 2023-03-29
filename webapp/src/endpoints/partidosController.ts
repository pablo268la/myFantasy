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
	return response.json();
}