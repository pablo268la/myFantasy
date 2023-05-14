import { IonGrid, IonRow } from "@ionic/react";
import styled from "styled-components";
import {
	Equipo,
	Jugador,
	PropiedadJugador,
	PuntuacionJugador,
	Usuario,
} from "../../../shared/sharedTypes";
import { Formacion } from "../VistaPlantilla";
import CartaJugadorPuntuacion from "./CartaJugadorPuntuacion";

const MyGrid = styled(IonGrid)`
	--ion-grid-columns: 10;
`;

type AlineacionPuntuacionesProps = {
	formacion: Formacion;
	setJugadorPulsado: (idJugador: string) => void;
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	usuario: Usuario | undefined;
	jornada: number;
	puntuacionesMap: Map<string, PuntuacionJugador[]>;
};

export function AlineacionPuntuaciones(
	props: AlineacionPuntuacionesProps
): JSX.Element {
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
							crearCartaJugador(
								jugador,
								props.setJugadorPulsado,
								"Portero",
								props.puntuacionesMap.get(
									jugador.jugador.id
								) as PuntuacionJugador[],
								props.jornada
							)
						)}
				</IonRow>
				<IonRow style={{ justifyContent: "center" }}>
					{props.defensas
						.slice(0, props.formacion.defensa)
						.map((jugador) =>
							crearCartaJugador(
								jugador,
								props.setJugadorPulsado,
								"Defensa",
								props.puntuacionesMap.get(
									jugador.jugador.id
								) as PuntuacionJugador[],
								props.jornada
							)
						)}
				</IonRow>
				<IonRow style={{ justifyContent: "center" }}>
					{props.mediocentros
						.slice(0, props.formacion.medio)
						.map((jugador) =>
							crearCartaJugador(
								jugador,
								props.setJugadorPulsado,
								"Mediocentro",
								props.puntuacionesMap.get(
									jugador.jugador.id
								) as PuntuacionJugador[],
								props.jornada
							)
						)}
				</IonRow>
				<IonRow style={{ justifyContent: "center" }}>
					{props.delanteros
						.slice(0, props.formacion.delantero)
						.map((jugador) =>
							crearCartaJugador(
								jugador,
								props.setJugadorPulsado,
								"Delantero",
								props.puntuacionesMap.get(
									jugador.jugador.id
								) as PuntuacionJugador[],
								props.jornada
							)
						)}
				</IonRow>
			</MyGrid>
		</>
	);
}

function crearCartaJugador(
	jugador: PropiedadJugador,
	setJugadorPulsado: (idJugador: string) => void,
	posicion: string,
	puntuaciones: PuntuacionJugador[],
	jornada: number
): JSX.Element {
	return jugador.titular ? (
		<CartaJugadorPuntuacion
			key={jugador.jugador.id}
			jugador={jugador}
			setJugadorPulsado={setJugadorPulsado}
			posicion={posicion}
			puntuaciones={puntuaciones}
			jornada={jornada}
		/>
	) : (
		<CartaJugadorPuntuacion
			key={jugador.jugador.id}
			setJugadorPulsado={setJugadorPulsado}
			posicion={posicion}
			jornada={jornada}
		/>
	);
}

function crearJugadorEmpty(): Jugador {
	return {
		id: "empty",
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
		id: "empty",
		nombre: "",
		slug: "",
		shortName: "",
		escudo: "",
	};
}
