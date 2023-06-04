import { IonGrid, IonRow } from "@ionic/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getUsuarioLogueado } from "../../../helpers/helpers";
import {
	AlineacionJugador,
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
	setJugadorPulsado: (idJugador: string) => void;
	alineacion: AlineacionJugador;
	jornada: number;
	formacion: Formacion;
	puntuacionesMap: Map<string, PuntuacionJugador[]>;
};

export function AlineacionPuntuaciones(
	props: AlineacionPuntuacionesProps
): JSX.Element {
	const usuario = getUsuarioLogueado() as Usuario;

	const [alineacion, setAlineacion] = useState<AlineacionJugador>();

	const [formacion, setFormacion] = useState<Formacion>();

	const meterVacios = (a: AlineacionJugador) => {
		const f = {
			portero: 1,
			defensa: Number.parseInt(a.formacion.split("-")[0]),
			medio: Number.parseInt(a.formacion.split("-")[1]),
			delantero: Number.parseInt(a.formacion.split("-")[2]),
		};
		setFormacion(f);
		setAlineacion(a);
	};

	useEffect(() => {
		meterVacios(props.alineacion);
	}, [props.alineacion]);

	return (
		<>
			<MyGrid>
				{alineacion?.porteros.length !== 0 ? (
					<IonRow style={{ justifyContent: "center" }}>
						<>
							{alineacion?.porteros
								.slice(0, formacion?.portero as number)
								.map((jugador) =>
									crearCartaJugador(
										jugador,
										props.setJugadorPulsado,
										"Portero",
										props.puntuacionesMap
											.get(jugador.jugador.id)
											?.at(0) as PuntuacionJugador,
										props.jornada
									)
								)}
						</>
					</IonRow>
				) : (
					<>
						<IonRow style={{ justifyContent: "center" }}>
							{[1].map((jugador) =>
								crearCartaJugador(
									{
										jugador: crearJugadorEmpty(),
										usuario: usuario,
										titular: false,
										venta: {
											enVenta: false,
											ofertas: [],
											fechaLimite: "",
										},
									},
									props.setJugadorPulsado,
									"Portero",
									null as any,
									props.jornada
								)
							)}
						</IonRow>
					</>
				)}
				{alineacion?.defensas.length !== 0 ? (
					<IonRow style={{ justifyContent: "center" }}>
						<>
							{alineacion?.defensas
								.slice(0, formacion?.defensa as number)
								.map((jugador) =>
									crearCartaJugador(
										jugador,
										props.setJugadorPulsado,
										"Defensa",
										props.puntuacionesMap
											.get(jugador.jugador.id)
											?.at(0) as PuntuacionJugador,
										props.jornada
									)
								)}
						</>
					</IonRow>
				) : (
					<>
						<IonRow style={{ justifyContent: "center" }}>
							{[1, 2, 3, 4].map((jugador) =>
								crearCartaJugador(
									{
										jugador: crearJugadorEmpty(),
										usuario: usuario,
										titular: false,
										venta: {
											enVenta: false,
											ofertas: [],
											fechaLimite: "",
										},
									},
									props.setJugadorPulsado,
									"Defensa",
									null as any,
									props.jornada
								)
							)}
						</IonRow>
					</>
				)}
				{alineacion?.medios.length !== 0 ? (
					<IonRow style={{ justifyContent: "center" }}>
						<>
							{alineacion?.medios
								.slice(0, formacion?.medio as number)
								.map((jugador) =>
									crearCartaJugador(
										jugador,
										props.setJugadorPulsado,
										"Mediocentro",
										props.puntuacionesMap
											.get(jugador.jugador.id)
											?.at(0) as PuntuacionJugador,
										props.jornada
									)
								)}
						</>
					</IonRow>
				) : (
					<>
						<IonRow style={{ justifyContent: "center" }}>
							{[1, 2, 3].map((jugador) =>
								crearCartaJugador(
									{
										jugador: crearJugadorEmpty(),
										usuario: usuario,
										titular: false,
										venta: {
											enVenta: false,
											ofertas: [],
											fechaLimite: "",
										},
									},
									props.setJugadorPulsado,
									"Mediocentro",
									null as any,
									props.jornada
								)
							)}
						</IonRow>
					</>
				)}
				{alineacion?.delanteros.length !== 0 ? (
					<IonRow style={{ justifyContent: "center" }}>
						<>
							{alineacion?.delanteros
								.slice(0, formacion?.delantero as number)
								.map((jugador) =>
									crearCartaJugador(
										jugador,
										props.setJugadorPulsado,
										"Delantero",
										props.puntuacionesMap
											.get(jugador.jugador.id)
											?.at(0) as PuntuacionJugador,
										props.jornada
									)
								)}
						</>
					</IonRow>
				) : (
					<>
						<IonRow style={{ justifyContent: "center" }}>
							{[1, 2, 3].map((jugador) =>
								crearCartaJugador(
									{
										jugador: crearJugadorEmpty(),
										usuario: usuario,
										titular: false,
										venta: {
											enVenta: false,
											ofertas: [],
											fechaLimite: "",
										},
									},
									props.setJugadorPulsado,
									"Delantero",
									null as any,
									props.jornada
								)
							)}
						</IonRow>
					</>
				)}
			</MyGrid>
		</>
	);
}

function crearCartaJugador(
	jugador: PropiedadJugador,
	setJugadorPulsado: (idJugador: string) => void,
	posicion: string,
	puntuacion: PuntuacionJugador,
	jornada: number
): JSX.Element {
	return jugador.titular ? (
		<CartaJugadorPuntuacion
			key={jugador.jugador.id}
			jugador={jugador}
			setJugadorPulsado={setJugadorPulsado}
			posicion={posicion}
			puntuacion={puntuacion}
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
