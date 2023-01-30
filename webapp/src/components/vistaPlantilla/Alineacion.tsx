import { IonRow } from "@ionic/react";
import { Jugador, JugadorTitular } from "../../shared/sharedTypes";
import CartaJugador from "./CartaJugador";
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
	while (props.porteros.length < props.formacion.portero) {
		props.porteros.push({ jugador: crearJugadorEmpty(), titular: false });
	}
	while (props.defensas.length < props.formacion.defensa) {
		props.defensas.push({ jugador: crearJugadorEmpty(), titular: false });
	}
	while (props.mediocentros.length < props.formacion.medio) {
		props.mediocentros.push({ jugador: crearJugadorEmpty(), titular: false });
	}
	while (props.delanteros.length < props.formacion.delantero) {
		props.delanteros.push({ jugador: crearJugadorEmpty(), titular: false });
	}
	return (
		<>
			<IonRow style={{ justifyContent: "center" }}>
				{props.porteros
					.slice(0, 1)
					.map((jugador) =>
						crearCartaJugador(jugador, props.setJugadorPulsado, "Portero")
					)}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.defensas
					.slice(0, props.formacion.defensa)
					.map((jugador) => {
						console.log(jugador);
						return jugador;
					})
					.map((jugador) =>
						crearCartaJugador(jugador, props.setJugadorPulsado, "Defensa")
					)}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.mediocentros
					.slice(0, props.formacion.medio)
					.map((jugador) =>
						crearCartaJugador(jugador, props.setJugadorPulsado, "Mediocentro")
					)}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.delanteros
					.slice(0, props.formacion.delantero)
					.map((jugador) =>
						crearCartaJugador(jugador, props.setJugadorPulsado, "Delantero")
					)}
			</IonRow>
		</>
	);
}

function crearCartaJugador(
	jugador: JugadorTitular,
	setJugadorPulsado: (idJugador: string) => void,
	posicion: string
): JSX.Element {
	return jugador.titular ? (
		<CartaJugador
			key={jugador.jugador._id}
			jugador={jugador}
			setJugadorPulsado={setJugadorPulsado}
			posicion={posicion}
		/>
	) : (
		<CartaJugador
			key={jugador.jugador._id}
			setJugadorPulsado={setJugadorPulsado}
			posicion={posicion}
		/>
	);
}

function crearJugadorEmpty(): Jugador {
	return {
		_id: "empty",
		nombre: "",
		slug: "",
		posicion: "",
		idEquipo: "",
		valor: 0,
		puntos: 0,
		estado: "",
		foto: "",
		jugadorAntiguo: {},
		puntuaciones: [],
		fantasyMarcaId: "",
	};
}
