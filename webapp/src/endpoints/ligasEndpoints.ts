import * as UUID from "uuid";
import {
	getToken,
	getUsuarioLogueado,
	updateUsuarioInfo,
} from "../helpers/helpers";
import { Liga, PlantillaUsuario } from "../shared/sharedTypes";

const apiEndPoint = "http://" + process.env.REACT_APP_API_URI + ":5000";
//const apiEndPoint = "http://localhost:5000";

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

	switch (response.status) {
		case 200:
			return response.json();
		case 401:
			throw new Error("Usuario no autorizado");
		case 409:
			throw new Error("No pertenece a la liga");
		case 500:
			throw new Error("Error interno");
		default:
			throw new Error("Error desconocido");
	}
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

	switch (response.status) {
		case 200:
			return response.json();
		case 401:
			throw new Error("Usuario no autorizado");
		case 500:
			throw new Error("Error interno");
		default:
			throw new Error("Error desconocido");
	}
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

	await updateUsuarioInfo();
	switch (response.status) {
		case 201:
			return response.json();
		case 401:
			throw new Error("No autorizado");
		case 500:
			throw new Error("Error interno");
		default:
			throw new Error("Error desconocido");
	}
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

	await updateUsuarioInfo();
	switch (response.status) {
		case 200:
			return response.json();
		case 204:
			throw new Error("Liga no encontrada");
		case 401:
			throw new Error("No autorizado");
		case 409:
			throw new Error(JSON.stringify(response.json()));
		case 500:
			throw new Error("Error interno");
		default:
			throw new Error("Error desconocido");
	}
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

	switch (response.status) {
		case 200:
			return response.json();
		case 204:
			throw new Error("No hay liga disponible");
		case 401:
			throw new Error("Usuario no autorizado");
		case 500:
			throw new Error("Error interno");
		default:
			throw new Error("Error desconocido");
	}
}

export const checkJoinLiga: (idLiga: string) => Promise<boolean> = async (
	idLiga: string
) => {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/ligas/join/" + idLiga, {
		method: "GET",
		headers: {
			email: email,
			token: token,
		},
	});

	switch (response.status) {
		case 200:
			return true;
		case 401:
			throw new Error("Usuario no autorizado");
		case 409:
			return false;
		case 500:
			throw new Error("Error interno");
		default:
			throw new Error("Error desconocido");
	}
};
