import { apiEndPoint } from "../helpers/constants";
import { Usuario } from "../shared/sharedTypes";
import { doRequest } from "./callBackEnd";

export async function getUsuario(email: string): Promise<Usuario> {
	return await doRequest(apiEndPoint + "/usuario/" + email);
}

export async function createUsuario(usuario: Usuario): Promise<Usuario> {
	return await doRequest(apiEndPoint + "/usuario", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(usuario),
	});
}

export async function requestToken(
	email: string,
	contraseña: string
): Promise<string> {
	return await doRequest(apiEndPoint + "/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, contraseña }),
	});
}
