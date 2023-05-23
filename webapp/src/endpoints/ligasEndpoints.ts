import * as UUID from "uuid";
import { apiEndPoint } from "../helpers/constants";
import {
	getToken,
	getUsuarioLogueado
} from "../helpers/helpers";
import { Liga, PlantillaUsuario } from "../shared/sharedTypes";
import { doRequest } from "./callBackEnd";

export async function getLiga(idLiga: string): Promise<Liga> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();
	return await doRequest(apiEndPoint + "/ligas/" + idLiga, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
	});
}

export async function getLigasUsuario(): Promise<Liga[]> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();
	const idUsuario = getUsuarioLogueado()?.id as string;

	return await doRequest(apiEndPoint + "/ligas/usuario/" + idUsuario, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
	});
}

export async function crearLiga(
	nombre: string,
	maxJugadores: number,
	ligaPrivada: boolean
): Promise<Liga> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let idLiga = UUID.v4();
	const liga: Liga = {
		id: idLiga,
		nombre: nombre,
		plantillasUsuarios: [],
		propiedadJugadores: [],
		maxJugadores: maxJugadores,
		enlaceInvitacion: "join-to:" + idLiga,
		mercado: [],
		configuracion: JSON.stringify({
			ligaPrivada: ligaPrivada,
		}),
	};

	return await doRequest(apiEndPoint + "/ligas", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({ liga: liga }),
	});
}

export async function añadirUsuarioALiga(
	idLiga: string
): Promise<PlantillaUsuario> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/ligas/" + idLiga, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
	});
}

export async function getRandomLiga(): Promise<Liga> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/ligas/random/new", {
		method: "GET",
		headers: {
			email: email,
			token: token,
		},
	});
}

export async function deleteUsuarioFromLiga(
	idLiga: string,
	idUsuario: string
): Promise<void> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/ligas/" + idLiga + "/" + idUsuario, {
		method: "DELETE",
		headers: {
			email: email,
			token: token,
		},
	});
}
