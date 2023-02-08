import { IonBadge, IonIcon } from "@ionic/react";
import { alertCircle, checkmarkCircle, medkit, warning } from "ionicons/icons";
import { getUsuario, requestToken } from "../endpoints/userEndpoints";
import { Usuario } from "../shared/sharedTypes";

export const urlBackground: string = `url(https://ih1.redbubble.net/image.389384727.9608/flat,128x,075,f-pad,128x128,f8f8f8.u5.jpg)`;
export const urlBackground2: string = `url(https://static.vecteezy.com/system/resources/previews/007/492/570/original/sport-background-illustration-suitable-for-banners-and-more-free-vector.jpg)`;

export function ponerPuntosAValor(valor: number) {
	let v = new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
	}).format(valor);
	return v.substring(0, v.length - 5) + " €";
}

export function getIconoEstado(estado: string) {
	switch (estado) {
		case "Disponible":
			return (
				<IonBadge color={"success"}>
					<IonIcon icon={checkmarkCircle} />
				</IonBadge>
			);
		case "Lesionado":
			return (
				<IonBadge color={"danger"}>
					<IonIcon icon={medkit} />
				</IonBadge>
			);
		case "Dudoso":
			return (
				<IonBadge color={"warning"}>
					<IonIcon icon={warning} />
				</IonBadge>
			);
		case "No disponible":
			return (
				<IonBadge color={"danger"}>
					<IonIcon icon={alertCircle} />
				</IonBadge>
			);
	}
}

export function getColorBadge(posicion: string) {
	switch (posicion) {
		case "Portero":
			return "#AA0000";
		case "Defensa":
			return "#00AA00";
		case "Mediocentro":
			return "#0000AA";
		case "Delantero":
			return "#CCAA00";
		default:
			return "#111111";
	}
}

export async function setUsuarioAndRequestToken(
	email: string,
	contraseña: string
): Promise<boolean> {
	const newToken = await requestToken(email, contraseña);
	if (newToken !== null && newToken !== undefined) {
		let token = newToken;
		let usuario = await getUsuario(email);
		localStorage.setItem("token", token);
		localStorage.setItem("usuario", JSON.stringify(usuario));
		return true;
	} else {
		return false;
	}
}

export async function updateUsuarioInfo() {
	let usuario = await getUsuario(getUsuarioLogueado()?.email as string);
	localStorage.setItem("usuario", JSON.stringify(usuario));
}

export function getToken(): string {
	return localStorage.getItem("token") as string;
}

export function getUsuarioLogueado(): Usuario | undefined {
	let u = JSON.parse(localStorage.getItem("usuario") as string);
	return u;
}
