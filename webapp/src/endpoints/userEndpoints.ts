import { apiEndPoint } from "../helpers/constants";
import { updateUsuarioInfo } from "../helpers/helpers";
import { Usuario } from "../shared/sharedTypes";

export async function getUsuario(email: string): Promise<Usuario> {
	// Dar una vuelta para la verificacion
	let response = await fetch(apiEndPoint + "/usuario/" + email);
	return response.json();
}

export async function createUsuario(usuario: Usuario): Promise<Usuario> {
	let response = await fetch(apiEndPoint + "/usuario", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(usuario),
	});

	switch (response.status) {
		case 201:
			await updateUsuarioInfo();
			return response.json();
		case 409:
			throw new Error("El usuario ya existe");
		case 500:
			throw new Error("Error en el servidor");
		default:
			throw new Error("Error al crear usuario");
	}
}

export async function updateUsuario(usuario: Usuario): Promise<Usuario> {
	let response = await fetch(apiEndPoint + "/usuario/" + usuario.email, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(usuario),
	});

	return response.json();
}

export async function requestToken(
	email: string,
	contraseña: string
): Promise<string> {
	let response = await fetch(apiEndPoint + "/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, contraseña }),
	});

	if (response.ok) {
		return response.json();
	} else {
		throw new Error("Contraseña incorrecta");
	}
}

export async function verifyToken(
	token: string,
	email: string
): Promise<boolean> {
	let response = await fetch(apiEndPoint + "/usuario/token", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token, email }),
	});

	if (response.ok) {
		return true;
	}
	return false;
}
