import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { Liga, Oferta, PropiedadJugador } from "../shared/sharedTypes";

export async function resetMercado(liga: Liga): Promise<Liga> {
	let response = await fetch(apiEndPoint + "/mercado/resetMercado/" + liga._id);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
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

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function añadirJugadorAMercado(
	propiedadJugador: PropiedadJugador,
	idLiga: string
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/mercado/anadir/" + idLiga, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({ propiedadJugador: propiedadJugador }),
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function aceptarOferta(
	idLiga: string,
	idComprador: string,
	idJugadorEnVenta: string
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(apiEndPoint + "/mercado/aceptaroferta/" + idLiga, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({
			idComprador: idComprador,
			idJugadorEnVenta: idJugadorEnVenta,
		}),
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function rechazarOferta(
	idLiga: string,
	idComprador: string,
	idJugadorEnVenta: string
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	let response = await fetch(
		apiEndPoint + "/mercado/rechazaroferta/" + idLiga,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				email: email,
				token: token,
			},
			body: JSON.stringify({
				idComprador: idComprador,
				idJugadorEnVenta: idJugadorEnVenta,
			}),
		}
	);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}
