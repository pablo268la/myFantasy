import { IonCol, IonLabel, IonRow } from "@ionic/react";
import { useEffect } from "react";
import { Partido, PuntuacionJugador } from "../../shared/sharedTypes";
import { PuntuacionJugadorAdmin } from "./PuntuacionJugadorAdmin";

type VistaAdminListaPuntuacionesProps = {
	partido: Partido;
	jornada: number;
	puntuacionesPartido: PuntuacionJugador[];
	setPuntuacionesCambiadas: (puntuacionesCambiadas: boolean) => void;
	addChangedPuntuacion: (puntuacion: PuntuacionJugador) => void;
	deleteChangedPuntuacion: (puntuacion: PuntuacionJugador) => void;
};

export function VistaAdminListaPuntuaciones(
	props: VistaAdminListaPuntuacionesProps
): JSX.Element {
	useEffect(() => {}, [props.puntuacionesPartido]);

	return (
		<>
			<IonRow>
				<IonCol>
					<IonRow style={{ justifyContent: "center" }}>
						<IonLabel>{props.partido.local.nombre}</IonLabel>
					</IonRow>
					{props.partido.alineacionLocal.jugadoresTitulares.map((j) => (
						<PuntuacionJugadorAdmin
							key={j._id}
							jugador={j}
							jornada={props.jornada}
							puntuacion={
								props.puntuacionesPartido.find(
									(p) => p.idJugador === j._id
								) as PuntuacionJugador
							}
							rival={props.partido.visitante.nombre}
							setPuntuacionesCambiadas={props.setPuntuacionesCambiadas}
							addChangedPuntuacion={props.addChangedPuntuacion}
							deleteChangedPuntuacion={props.deleteChangedPuntuacion}
						/>
					))}
					<IonRow style={{ justifyContent: "center" }}>
						<IonLabel>{"Suplentes " + props.partido.local.nombre}</IonLabel>
					</IonRow>
					{props.partido.alineacionLocal.jugadoresSuplentes.map((j) => (
						<PuntuacionJugadorAdmin
							key={j._id}
							jugador={j}
							jornada={props.jornada}
							puntuacion={
								props.puntuacionesPartido.find(
									(p) => p.idJugador === j._id
								) as PuntuacionJugador
							}
							rival={props.partido.visitante.nombre}
							setPuntuacionesCambiadas={props.setPuntuacionesCambiadas}
							addChangedPuntuacion={props.addChangedPuntuacion}
							deleteChangedPuntuacion={props.deleteChangedPuntuacion}
						/>
					))}
				</IonCol>
				<IonCol>
					<IonRow style={{ justifyContent: "center" }}>
						<IonLabel>{props.partido.visitante.nombre}</IonLabel>
					</IonRow>

					{props.partido.alineacionVisitante.jugadoresTitulares.map((j) => (
						<PuntuacionJugadorAdmin
							key={j._id}
							jugador={j}
							jornada={props.jornada}
							puntuacion={
								props.puntuacionesPartido.find(
									(p) => p.idJugador === j._id
								) as PuntuacionJugador
							}
							rival={props.partido.local.nombre}
							setPuntuacionesCambiadas={props.setPuntuacionesCambiadas}
							addChangedPuntuacion={props.addChangedPuntuacion}
							deleteChangedPuntuacion={props.deleteChangedPuntuacion}
						/>
					))}
					<IonRow style={{ justifyContent: "center" }}>
						<IonLabel>{"Suplentes " + props.partido.visitante.nombre}</IonLabel>
					</IonRow>
					{props.partido.alineacionVisitante.jugadoresSuplentes.map((j) => (
						<PuntuacionJugadorAdmin
							key={j._id}
							jugador={j}
							jornada={props.jornada}
							puntuacion={
								props.puntuacionesPartido.find(
									(p) => p.idJugador === j._id
								) as PuntuacionJugador
							}
							rival={props.partido.local.nombre}
							setPuntuacionesCambiadas={props.setPuntuacionesCambiadas}
							addChangedPuntuacion={props.addChangedPuntuacion}
							deleteChangedPuntuacion={props.deleteChangedPuntuacion}
						/>
					))}
				</IonCol>
			</IonRow>
		</>
	);
}
