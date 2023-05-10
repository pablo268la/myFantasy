import * as UUID from "uuid";
import { apiEndPoint } from "../helpers/constants";
import {
	getToken,
	getUsuarioLogueado
} from "../helpers/helpers";
import { Liga, PlantillaUsuario } from "../shared/sharedTypes";

export async function getLiga(idLiga: string): Promise<Liga> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();
	let response = await fetch(apiEndPoint + "/ligas/" + idLiga, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function getLigasUsuario(): Promise<Liga[]> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();
	const idUsuario = getUsuarioLogueado()?.id as string;

	let response = await fetch(apiEndPoint + "/ligas/usuario/" + idUsuario, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function crearLiga(
	nombre: string,
	maxJugadores: number,
	usaEntrenador: boolean
): Promise<Liga> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let idLiga = UUID.v4();
	const liga: Liga = {
		_id: idLiga,
		nombre: nombre,
		plantillasUsuarios: [],
		propiedadJugadores: [],
		maxJugadores: maxJugadores,
		enlaceInvitacion: "join-to:" + idLiga,
		mercado: [],
		configuracion: JSON.stringify({
			usaEntrenador: usaEntrenador,
		}),
	};

	let response = await fetch(apiEndPoint + "/ligas", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({ liga: liga }),
	});

	if (response.status !== 201) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function añadirUsuarioALiga(
	idLiga: string
): Promise<PlantillaUsuario> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/ligas/" + idLiga, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function getRandomLiga(): Promise<Liga> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/ligas/random/new", {
		method: "GET",
		headers: {
			email: email,
			token: token,
		},
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function checkJoinLiga(idLiga: string): Promise<boolean> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/ligas/join/" + idLiga, {
		method: "GET",
		headers: {
			email: email,
			token: token,
		},
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}
