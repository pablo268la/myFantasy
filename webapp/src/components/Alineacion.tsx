import { IonRow } from "@ionic/react";
import { JugadorTitular } from "../shared/sharedTypes";
import { CartaJugador } from "./CartaJugador";
import { Formacion } from "./VistaPlantilla";

type AlineacionProps = {
	formacion: Formacion;
	setJugadorPulsado: (idJugador: string) => void;
	porteros: JugadorTitular[];
	defensas: JugadorTitular[];
	mediocentros: JugadorTitular[];
	delanteros: JugadorTitular[];
};

export function Alineacion(props: AlineacionProps): JSX.Element {
	return (
		<>
			<IonRow style={{ justifyContent: "center" }}>
				{props.porteros
					.slice(0, 1)
					.map((jugador) => crearCartaJugador(jugador, props, "Portero"))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.defensas
					.slice(0, props.formacion.defensa)
					.map((jugador) => crearCartaJugador(jugador, props, "Defensa"))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.mediocentros
					.slice(0, props.formacion.medio)
					.map((jugador) => crearCartaJugador(jugador, props, "Mediocentro"))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.delanteros
					.slice(0, props.formacion.delantero)
					.map((jugador) => crearCartaJugador(jugador, props, "Delantero"))}
			</IonRow>
		</>
	);
}
function crearCartaJugador(
	jugador: JugadorTitular,
	props: AlineacionProps,
	posicion: string
): JSX.Element {
	return jugador.titular ? (
		<CartaJugador
			key={jugador.jugador._id}
			jugador={jugador}
			setJugadorPulsado={props.setJugadorPulsado}
			posicion={posicion}
		/>
	) : (
		<CartaJugador
			key={jugador.jugador._id}
			setJugadorPulsado={props.setJugadorPulsado}
			posicion={posicion}
		/>
	);
}
