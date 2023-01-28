import { Liga } from "../shared/sharedTypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

export async function getLiga(
	idLiga: string,
	email: string,
	token: string
): Promise<Liga | null> {
	let response = await fetch(apiEndPoint + "/ligas/" + idLiga, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
	});

	if (response.status === 200) {
		return response.json();
	} else {
		return null;
	}
}

export async function getLigasUsuario(
	email: string,
	token: string
): Promise<Liga[]> {
	let response = await fetch(apiEndPoint + "/ligas", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			email: email,
			token: token,
		},
	});

	if (response.status === 200) {
		let ligas = [];
		for (let liga of await response.json()) {
			let l = await getLiga(liga, email, token);
			if (l) {
				ligas.push(l);
			}
		}
		console.log(ligas);
		return ligas;
	} else {
		return [];
	}
}
