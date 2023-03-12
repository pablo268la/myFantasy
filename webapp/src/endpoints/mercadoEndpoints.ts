import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { Liga, Oferta, PropiedadJugador } from "../shared/sharedTypes";

export async function resetMercado(liga: Liga): Promise<Liga> {
	let response = await fetch(apiEndPoint + "/mercado/resetMercado/" + liga._id);

	switch (response.status) {
		case 200:
			return response.json();
		case 401:
			throw new Error("Unauthorized");
		case 404:
			throw new Error("Not Found");
		case 500:
			throw new Error("Internal Server Error");
		default:
			throw new Error("Unknown Error");
	}
}

export async function hacerPuja(
	jugadorEnVenta: PropiedadJugador,
	idLiga: string,
	oferta: Oferta
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/mercado/pujar/" + idLiga, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({ jugadorEnVenta: jugadorEnVenta, oferta: oferta }),
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

export async function añadirJugadorAMercado(
	propiedadJugador: PropiedadJugador,
	idLiga: string
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	console.log(propiedadJugador);

	let response = await fetch(apiEndPoint + "/mercado/anadir/" + idLiga, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({ propiedadJugador: propiedadJugador }),
	});

	switch (response.status) {
		case 200:
			return response.json();
		case 401:
			throw new Error("Usuario no autorizado");
		case 404:
			throw new Error("Liga no encontrada");
		case 409:
			throw new Error("No pertenece a la liga");
		case 500:
			throw new Error("Error interno");
		default:
			throw new Error("Error desconocido");
	}
}
