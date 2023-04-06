import { IonGrid, IonRow } from "@ionic/react";
import styled from "styled-components";
import {
	Equipo,
	Jugador,
	PropiedadJugador,
	Usuario,
} from "../../../shared/sharedTypes";
import { Formacion } from "../VistaPlantilla";
import CartaJugador from "./CartaJugador";

const MyGrid = styled(IonGrid)`
	--ion-grid-columns: 10;
`;

type AlineacionProps = {
	formacion: Formacion;
	setJugadorPulsado: (idJugador: string) => void;
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	usuario: Usuario | undefined;
};

export function Alineacion(props: AlineacionProps): JSX.Element {
	if (props.usuario !== undefined) {
		while (props.porteros.length < props.formacion.portero) {
			props.porteros.push({
				jugador: crearJugadorEmpty(),
				usuario: props.usuario,
				titular: false,
				venta: {
					enVenta: false,
					ofertas: [],
					fechaLimite: "",
				},
			});
		}
		while (props.defensas.length < props.formacion.defensa) {
			props.defensas.push({
				jugador: crearJugadorEmpty(),
				usuario: props.usuario,
				titular: false,
				venta: {
					enVenta: false,
					ofertas: [],
					fechaLimite: "",
				},
			});
		}
		while (props.mediocentros.length < props.formacion.medio) {
			props.mediocentros.push({
				jugador: crearJugadorEmpty(),
				usuario: props.usuario,
				titular: false,
				venta: {
					enVenta: false,
					ofertas: [],
					fechaLimite: "",
				},
			});
		}
		while (props.delanteros.length < props.formacion.delantero) {
			props.delanteros.push({
				jugador: crearJugadorEmpty(),
				usuario: props.usuario,
				titular: false,
				venta: {
					enVenta: false,
					ofertas: [],
					fechaLimite: "",
				},
			});
		}
	}

	return (
		<>
			<MyGrid>
				<IonRow style={{ justifyContent: "center" }}>
					{props.porteros
						.slice(0, 1)
						.map((jugador) =>
							crearCartaJugador(jugador, props.setJugadorPulsado, "Portero")
						)}
				</IonRow>
				<IonRow style={{ justifyContent: "center" }}>
					{props.defensas
						.slice(0, props.formacion.defensa)
						.map((jugador) => {
							return jugador;
						})
						.map((jugador) =>
							crearCartaJugador(jugador, props.setJugadorPulsado, "Defensa")
						)}
				</IonRow>
				<IonRow style={{ justifyContent: "center" }}>
					{props.mediocentros
						.slice(0, props.formacion.medio)
						.map((jugador) =>
							crearCartaJugador(jugador, props.setJugadorPulsado, "Mediocentro")
						)}
				</IonRow>
				<IonRow style={{ justifyContent: "center" }}>
					{props.delanteros
						.slice(0, props.formacion.delantero)
						.map((jugador) =>
							crearCartaJugador(jugador, props.setJugadorPulsado, "Delantero")
						)}
				</IonRow>
			</MyGrid>
		</>
	);
}

function crearCartaJugador(
	jugador: PropiedadJugador,
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
		equipo: createEquipoEmpty(),
		valor: 0,
		puntos: 0,
		estado: "",
		foto: "",
		jugadorAntiguo: undefined,
		fantasyMarcaId: "",
	};
}

function createEquipoEmpty(): Equipo {
	return {
		_id: "empty",
		nombre: "",
		slug: "",
		shortName: "",
		escudo: "",
	};
}
