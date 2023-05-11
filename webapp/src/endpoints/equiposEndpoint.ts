import { apiEndPoint } from "../helpers/constants";
import { Equipo } from "../shared/sharedTypes";

export async function getEquipos(): Promise<Equipo[]> {
	let response = await fetch(apiEndPoint + "/equipos");

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}
