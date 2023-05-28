import { apiEndPoint } from "../helpers/constants";
import { getToken, getUsuarioLogueado } from "../helpers/helpers";
import { Liga, Oferta, PropiedadJugador } from "../shared/sharedTypes";
import { doRequest } from "./callBackEnd";

export async function resetMercado(liga: Liga): Promise<Liga> {
	return await doRequest(apiEndPoint + "/mercado/resetMercado/" + liga.id);
}

export async function hacerPuja(
	jugadorEnVenta: PropiedadJugador,
	idLiga: string,
	oferta: Oferta
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/mercado/pujar/" + idLiga, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({
			idJugadorEnVenta: jugadorEnVenta.jugador.id,
			oferta: oferta,
		}),
	});
}

export async function añadirJugadorAMercado(
	propiedadJugador: PropiedadJugador,
	idLiga: string
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/mercado/anadir/" + idLiga, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
		body: JSON.stringify({ propiedadJugador: propiedadJugador }),
	});
}

export async function aceptarOferta(
	idLiga: string,
	idComprador: string,
	idJugadorEnVenta: string
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/mercado/aceptaroferta/" + idLiga, {
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
}

export async function rechazarOferta(
	idLiga: string,
	idComprador: string,
	idJugadorEnVenta: string
): Promise<PropiedadJugador> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(apiEndPoint + "/mercado/rechazaroferta/" + idLiga, {
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
}

export async function eliminarJugadorDelMercado(
	idLiga: string,
	idJugador: string
): Promise<void> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(
		apiEndPoint + "/mercado/eliminar/" + idLiga + "/" + idJugador,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				email: email,
				token: token,
			},
		}
	);
}

export async function eliminaPujaDelMercado(
	idLiga: string,
	idJugador: string
): Promise<void> {
	const email = getUsuarioLogueado()?.email as string;
	const token = getToken();

	return await doRequest(
		apiEndPoint + "/mercado/eliminarPuja/" + idLiga + "/" + idJugador,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				email: email,
				token: token,
			},
		}
	);
}
