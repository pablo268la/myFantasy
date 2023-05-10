import { apiEndPoint } from "../helpers/constants";
import { Usuario } from "../shared/sharedTypes";

export async function getUsuario(email: string): Promise<Usuario> {
	// Dar una vuelta para la verificacion
	let response = await fetch(apiEndPoint + "/usuario/" + email);

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function createUsuario(usuario: Usuario): Promise<Usuario> {
	let response = await fetch(apiEndPoint + "/usuario", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(usuario),
	});

	if (response.status !== 201) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
	return response.json();
}

export async function updateUsuario(usuario: Usuario): Promise<Usuario> {
	let response = await fetch(apiEndPoint + "/usuario/" + usuario.email, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(usuario),
	});

	if (response.status !== 200) {
		await response.json().then((data) => {
			throw new Error(data.message);
		});
	}
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
