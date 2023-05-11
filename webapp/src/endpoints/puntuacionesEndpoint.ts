import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { PuntuacionJugador } from "../shared/sharedTypes";

export async function getPuntuacionJugador(
	jugadorId: string
): Promise<PuntuacionJugador[]> {
	let response = await fetch(apiEndPoint + "/puntuaciones/" + jugadorId);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function getPuntuacionJugadorSemana(
	jugadorId: string,
	semana: number
): Promise<PuntuacionJugador> {
	let response = await fetch(
		apiEndPoint + "/puntuaciones/" + jugadorId + "/" + semana
	);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function guardarPuntuacionJugador(
	puntuacion: PuntuacionJugador
): Promise<PuntuacionJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/puntuaciones", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify(puntuacion),
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}
