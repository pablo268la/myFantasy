import {
	AlineacionJugador,
	Jugador,
	PlantillaUsuario,
	Usuario
} from "../shared/sharedTypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

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

export async function getPlantilla(): Promise<PlantillaUsuario[]> {
	let response = await fetch(apiEndPoint + "/plantilla");
	return response.json();
}
export async function getAlineacionJugador(): Promise<AlineacionJugador[]> {
	let response = await fetch(apiEndPoint + "/alineacionjugador");
	return response.json();
}

export async function getUsuario(email: string): Promise<Usuario> {
	let response = await fetch(apiEndPoint + "/usuario/" + email);
	return response.json();
}

export async function createUsuario(usuario: Usuario): Promise<Usuario> {
	let response = await fetch(apiEndPoint + "/usuario", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(usuario),
	});

	return response.json();
}

export async function updateUsuario(usuario: Usuario): Promise<Usuario> {
	let response = await fetch(apiEndPoint + "/usuario/" + usuario.email, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(usuario),
	});

	return response.json();
}
