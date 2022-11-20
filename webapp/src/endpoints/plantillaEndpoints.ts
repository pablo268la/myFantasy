import { AlineacionJugador, PlantillaUsuario } from "../shared/sharedTypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

export async function getPlantilla(): Promise<PlantillaUsuario[]> {
	let response = await fetch(apiEndPoint + "/plantilla");
	return response.json();
}
export async function getAlineacionJugador(): Promise<AlineacionJugador[]> {
	let response = await fetch(apiEndPoint + "/alineacionjugador");
	return response.json();
}
