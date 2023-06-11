import { IonList, IonRow } from "@ionic/react";
import {
	AlineacionJugador,
	PropiedadJugador,
	PuntuacionJugador,
} from "../../../shared/sharedTypes";

import { useEffect } from "react";
import { CartaDetallesPuntuacionJugador } from "./CartaDetallesPuntuacionJugador";

type ListaJugadoresPuntuacionesProps = {
	alineacion: AlineacionJugador;
	setJugadorPulsado: (idJugador: string) => void;
	jornada: number;
	puntuacionesMap: Map<string, PuntuacionJugador[]>;
};

export function ListaJugadoresPuntuaciones(
	props: ListaJugadoresPuntuacionesProps
): JSX.Element {
	useEffect(() => {}, [props.puntuacionesMap]);
	return (
		<IonList>
			{props.alineacion?.porteros
				.filter((j) => j.jugador.id !== "empty")
				.filter((j) => j.titular === true)
				.map((j) =>
					crearCartaDetallesJugador(
						j,
						props.setJugadorPulsado,
						props.jornada,
						props.puntuacionesMap
					)
				)}
			{props.alineacion?.defensas
				.filter((j) => j.jugador.id !== "empty")
				.filter((j) => j.titular === true)
				.map((j) =>
					crearCartaDetallesJugador(
						j,
						props.setJugadorPulsado,
						props.jornada,
						props.puntuacionesMap
					)
				)}
			{props.alineacion?.medios
				.filter((j) => j.jugador.id !== "empty")
				.filter((j) => j.titular === true)
				.map((j) =>
					crearCartaDetallesJugador(
						j,
						props.setJugadorPulsado,
						props.jornada,
						props.puntuacionesMap
					)
				)}
			{props.alineacion?.delanteros
				.filter((j) => j.jugador.id !== "empty")
				.filter((j) => j.titular === true)
				.map((j) =>
					crearCartaDetallesJugador(
						j,
						props.setJugadorPulsado,
						props.jornada,
						props.puntuacionesMap
					)
				)}
		</IonList>
	);
}

function crearCartaDetallesJugador(
	j: PropiedadJugador,
	setJugadorPulsado: (idJugador: string) => void,
	jornada: number,
	puntuacion: Map<string, PuntuacionJugador[]>
): JSX.Element {
	return (
		<IonRow key={j.jugador.id}>
			<CartaDetallesPuntuacionJugador
				propiedadJugador={j}
				showPuntuaciones={false}
				setJugadorPulsado={setJugadorPulsado}
				jornada={jornada}
				puntuacionesJugador={puntuacion}
			/>
		</IonRow>
	);
}
