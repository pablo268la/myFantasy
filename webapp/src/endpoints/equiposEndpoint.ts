import { Equipo } from "../shared/sharedTypes";

//const apiEndPoint = "http://" + process.env.REACT_APP_API_URI + ":5000";
const apiEndPoint = "http://localhost:5000";

export async function getEquipos(): Promise<Equipo[]> {
	let response = await fetch(apiEndPoint + "/equipos");
	return response.json();
}
