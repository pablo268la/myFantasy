import { IonGrid, IonList, IonRow } from "@ionic/react";
import { useState } from "react";
import {
    PropiedadJugador,
    PuntuacionJugador,
} from "../../../shared/sharedTypes";
import { PuntuacionesJugador } from "../PuntuacionesJugador";
import { Formacion } from "../VistaPlantilla";
import { CartaDetallesJugador } from "./CartaDetallesJugador";

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
	jornada: number;
	puntuacionesMap: Map<string, PuntuacionJugador[]>;
};

export function ListaJugadores(props: ListaJugadoresProps): JSX.Element {
	const [showPuntuacionJugador, setShowPuntuacionJugador] = useState<boolean>();

	const [jugadorSeleccionado, setJugadorSeleccionado] =
		useState<PropiedadJugador>();

	const setJugadorSeleccionadoMethod = (pj: PropiedadJugador) => {
		if (pj !== undefined && jugadorSeleccionado === undefined) {
			setJugadorSeleccionado(pj);
			setShowPuntuacionJugador(true);
		} else {
			setShowPuntuacionJugador(false);
			setJugadorSeleccionado(undefined);
		}
	};

	return !showPuntuacionJugador ? (
		<>
			<IonList>
				{props.porteros
					.filter((j) => j.jugador.id !== "empty")
					.map((j) =>
						crearCartaDetallesJugador(j, props, setJugadorSeleccionadoMethod)
					)}
				{props.defensas
					.filter((j) => j.jugador.id !== "empty")
					.map((j) =>
						crearCartaDetallesJugador(j, props, setJugadorSeleccionadoMethod)
					)}
				{props.mediocentros
					.filter((j) => j.jugador.id !== "empty")
					.map((j) =>
						crearCartaDetallesJugador(j, props, setJugadorSeleccionadoMethod)
					)}
				{props.delanteros
					.filter((j) => j.jugador.id !== "empty")
					.map((j) =>
						crearCartaDetallesJugador(j, props, setJugadorSeleccionadoMethod)
					)}
			</IonList>
		</>
	) : (
		<>
			<IonGrid>
				{crearCartaDetallesJugador(
					jugadorSeleccionado as PropiedadJugador,
					props,
					setJugadorSeleccionadoMethod
				)}
				<PuntuacionesJugador
					jugador={jugadorSeleccionado as PropiedadJugador}
					jornada={props.jornada}
					puntuaciones={
						props.puntuacionesMap.get(
							jugadorSeleccionado?.jugador.id as string
						) as PuntuacionJugador[]
					}
				/>
			</IonGrid>
		</>
	);
}

function crearCartaDetallesJugador(
	j: PropiedadJugador,
	props: ListaJugadoresProps,
	setJugadorSeleccionadoMethod: (pj: PropiedadJugador) => void
): JSX.Element {
	return (
		<IonRow key={j.jugador.id}>
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
				setJugadorSeleccionadoMethod={setJugadorSeleccionadoMethod}
			/>
		</IonRow>
	);
}
