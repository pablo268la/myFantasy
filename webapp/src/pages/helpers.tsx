import { IonBadge, IonIcon } from "@ionic/react";
import { alertCircle, checkmarkCircle, medkit, warning } from "ionicons/icons";
import { Jugador } from "../shared/sharedTypes";

export const urlBackground: string = `url(https://ih1.redbubble.net/image.389384727.9608/flat,128x,075,f-pad,128x128,f8f8f8.u5.jpg)`;

export function ponerPuntosAValor(valor: number) {
	let v = new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
	}).format(valor);
	return v.substring(0, v.length - 5) + " €";
}

export function getIconoEstado(jugador: Jugador) {
	switch (jugador.estado) {
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
