import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { AlineacionJugador, PlantillaUsuario } from "../shared/sharedTypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

export async function getPlantilla(
	idLiga: string,
	idUsuario: string
): Promise<PlantillaUsuario> {
	let response = await fetch(
		apiEndPoint + "/plantillas/" + idLiga + "/" + idUsuario
	);
	return response.json();
}

export async function getAlineacionJugador(): Promise<AlineacionJugador[]> {
	let response = await fetch(apiEndPoint + "/alineacionjugador");
	return response.json();
}

export async function crearPlantillaUsuario(
	idLiga: string
): Promise<PlantillaUsuario> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/plantillas/crear", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({
			idLiga: idLiga,
			idUsuario: getUsuarioLogueado()?.id,
		}),
	});

	switch (response.status) {
		case 201:
			return response.json();
		case 401:
			throw new Error("No autorizado");
		case 500:
			throw new Error("Error en el servidor");
		default:
			throw new Error("Error al crear plantilla");
	}
}

export async function updatePlantillaUsuario(plantilla: PlantillaUsuario) {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/plantillas/update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify(plantilla),
	});
	return response.json();
}
