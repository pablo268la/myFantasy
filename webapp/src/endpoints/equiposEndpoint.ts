import { apiEndPoint } from "../helpers/constants";
import { Equipo } from "../shared/sharedTypes";
import { doRequest } from "./callBackEnd";

export async function getEquipos(): Promise<Equipo[]> {
	return await doRequest(apiEndPoint + "/equipos");
}
