import { Equipo } from "../shared/sharedTypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

export async function getEquipos(): Promise<Equipo[]> {
	let response = await fetch(apiEndPoint + "/equipos");
	return response.json();
}
