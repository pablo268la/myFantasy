import { IonCol, IonContent, IonRow } from "@ionic/react";
import { JugadorTitular } from "../shared/sharedTypes";

import { CartaDetallesJugador } from "./CartaDetallesJugador";
import { Formacion } from "./VistaPlantilla";

type ListaJugadoresProps = {
	porteros: JugadorTitular[];
	defensas: JugadorTitular[];
	mediocentros: JugadorTitular[];
	delanteros: JugadorTitular[];
	formacion: Formacion;
	cambiarTitulares: (
		lista: JugadorTitular[],
		idIn: string,
		idOut: string
	) => void;
};

export function ListaJugadores(props: ListaJugadoresProps): JSX.Element {
	return (
		<IonContent>
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
		</IonContent>
	);
}

function crearCartaDetallesJugador(
	j: JugadorTitular,
	props: ListaJugadoresProps
): JSX.Element {
	return (
		<IonRow key={j.jugador._id}>
			<IonCol>
				<CartaDetallesJugador
					jugador={j}
					esParaCambio={false}
					porteros={props.porteros}
					defensas={props.defensas}
					mediocentros={props.mediocentros}
					delanteros={props.delanteros}
					formacion={props.formacion}
					cambiarTitulares={props.cambiarTitulares}
				/>
			</IonCol>
		</IonRow>
	);
}
