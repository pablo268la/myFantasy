import { IonList, IonRow } from "@ionic/react";
import { PropiedadJugador } from "../../shared/sharedTypes";

import { CartaDetallesJugador } from "./CartaDetallesJugador";
import { Formacion } from "./VistaPlantilla";

type ListaJugadoresProps = {
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	formacion: Formacion;
	cambiarTitulares: (
		lista: PropiedadJugador[],
		idIn: string,
		idOut: string
	) => void;
	isSameUser: boolean;
};

export function ListaJugadores(props: ListaJugadoresProps): JSX.Element {
	return (
		<IonList>
			{props.porteros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) => crearCartaDetallesJugador(j, props))}
			{props.defensas
				.filter((j) => j.jugador._id !== "empty")
				.map((j) => crearCartaDetallesJugador(j, props))}
			{props.mediocentros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) => crearCartaDetallesJugador(j, props))}
			{props.delanteros
				.filter((j) => j.jugador._id !== "empty")
				.map((j) => crearCartaDetallesJugador(j, props))}
		</IonList>
	);
}

function crearCartaDetallesJugador(
	j: PropiedadJugador,
	props: ListaJugadoresProps
): JSX.Element {
	return (
		<IonRow key={j.jugador._id}>
			<CartaDetallesJugador
				propiedadJugador={j}
				esParaCambio={false}
				porteros={props.porteros}
				defensas={props.defensas}
				mediocentros={props.mediocentros}
				delanteros={props.delanteros}
				formacion={props.formacion}
				cambiarTitulares={props.cambiarTitulares}
				isSameUser={props.isSameUser}
			/>
		</IonRow>
	);
}
