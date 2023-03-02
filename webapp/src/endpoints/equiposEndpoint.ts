import { apiEndPoint } from "../helpers/constants";
import { Equipo } from "../shared/sharedTypes";

export async function getEquipos(): Promise<Equipo[]> {
	let response = await fetch(apiEndPoint + "/equipos");
	return response.json();
}
