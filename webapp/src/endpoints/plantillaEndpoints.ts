import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { PlantillaUsuario } from "../shared/sharedTypes";

export async function getPlantilla(
	idLiga: string,
	idUsuario: string
): Promise<PlantillaUsuario> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(
		apiEndPoint + "/plantillas/" + idLiga + "/" + idUsuario,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				email: email,
				token: token,
			},
		}
	);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function updatePlantillaUsuario(
	plantilla: PlantillaUsuario,
	idLiga: string
): Promise<PlantillaUsuario> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/plantillas/update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({ plantilla: plantilla, idLiga: idLiga }),
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}
