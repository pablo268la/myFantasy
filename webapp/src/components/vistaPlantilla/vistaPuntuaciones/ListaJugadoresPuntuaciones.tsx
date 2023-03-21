import { IonList, IonRow } from "@ionic/react";
import {
	PropiedadJugador,
	PuntuacionJugador,
} from "../../../shared/sharedTypes";

import { CartaDetallesPuntuacionJugador } from "./CartaDetallesPuntuacionJugador";

type ListaJugadoresPuntuacionesProps = {
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	setJugadorPulsado: (idJugador: string) => void;
	jornada: number;
	puntuacionesMap: Map<string, PuntuacionJugador[]>;
};

export function ListaJugadoresPuntuaciones(
	props: ListaJugadoresPuntuacionesProps
): JSX.Element {
	return (
		<IonList>
			{props.porteros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) =>
					crearCartaDetallesJugador(
						j,
						props.setJugadorPulsado,
						props.jornada,
						props.puntuacionesMap.get(j.jugador._id) as PuntuacionJugador[]
					)
				)}
			{props.defensas
				.filter((j) => j.jugador._id !== "empty")
				.map((j) =>
					crearCartaDetallesJugador(
						j,
						props.setJugadorPulsado,
						props.jornada,
						props.puntuacionesMap.get(j.jugador._id) as PuntuacionJugador[]
					)
				)}
			{props.mediocentros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) =>
					crearCartaDetallesJugador(
						j,
						props.setJugadorPulsado,
						props.jornada,
						props.puntuacionesMap.get(j.jugador._id) as PuntuacionJugador[]
					)
				)}
			{props.delanteros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) =>
					crearCartaDetallesJugador(
						j,
						props.setJugadorPulsado,
						props.jornada,
						props.puntuacionesMap.get(j.jugador._id) as PuntuacionJugador[]
					)
				)}
		</IonList>
	);
}

function crearCartaDetallesJugador(
	j: PropiedadJugador,
	setJugadorPulsado: (idJugador: string) => void,
	jornada: number,
	puntuaciones: PuntuacionJugador[]
): JSX.Element {
	return (
		<IonRow key={j.jugador._id}>
			<CartaDetallesPuntuacionJugador
				propiedadJugador={j}
				showPuntuaciones={false}
				setJugadorPulsado={setJugadorPulsado}
				jornada={jornada}
				puntuacionesJugador={puntuaciones}
			/>
		</IonRow>
	);
}
