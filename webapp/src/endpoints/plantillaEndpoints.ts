import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { PlantillaUsuario } from "../shared/sharedTypes";
import { doRequest } from "./callBackEnd";

export async function getPlantilla(
	idLiga: string,
	idUsuario: string
): Promise<PlantillaUsuario> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(
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
}

export async function updatePlantillaUsuario(
	plantilla: PlantillaUsuario,
	idLiga: string
): Promise<PlantillaUsuario> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/plantillas/update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({ plantilla: plantilla, idLiga: idLiga }),
	});
}
