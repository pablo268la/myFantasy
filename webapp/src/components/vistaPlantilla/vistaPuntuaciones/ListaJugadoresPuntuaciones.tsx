import { IonList, IonRow } from "@ionic/react";
import { PropiedadJugador } from "../../../shared/sharedTypes";

import { CartaPuntuacionJugador } from "./CartaPuntuacionJugador";

type ListaJugadoresPuntuacionesProps = {
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	setJugadorPulsado: (idJugador: string) => void;
	jornada: number;
};

export function ListaJugadoresPuntuaciones(
	props: ListaJugadoresPuntuacionesProps
): JSX.Element {
	return (
		<IonList>
			{props.porteros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) =>
					crearCartaDetallesJugador(j, props.setJugadorPulsado, props.jornada)
				)}
			{props.defensas
				.filter((j) => j.jugador._id !== "empty")
				.map((j) =>
					crearCartaDetallesJugador(j, props.setJugadorPulsado, props.jornada)
				)}
			{props.mediocentros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) =>
					crearCartaDetallesJugador(j, props.setJugadorPulsado, props.jornada)
				)}
			{props.delanteros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) =>
					crearCartaDetallesJugador(j, props.setJugadorPulsado, props.jornada)
				)}
		</IonList>
	);
}

function crearCartaDetallesJugador(
	j: PropiedadJugador,
	setJugadorPulsado: (idJugador: string) => void,
	jornada: number
): JSX.Element {
	return (
		<IonRow key={j.jugador._id}>
			<CartaPuntuacionJugador
				propiedadJugador={j}
				showPuntuaciones={false}
				setJugadorPulsado={setJugadorPulsado}
				jornada={jornada}
			/>
		</IonRow>
	);
}
