import { IonCol, IonLabel, IonRow } from "@ionic/react";
import { useEffect } from "react";
import { Partido } from "../../shared/sharedTypes";
import { VistaAdminPuntuacionJugador } from "./VistaAdminPuntuacionJugador";

type VistaAdminListaPuntuacionesProps = {
	partido: Partido;
	jornada: number;
	setPuntuacionesCambiadas: (puntuacionesCambiadas: boolean) => void;
	guardarPuntuaciones: boolean;
};

export function VistaAdminPuntuacionesLista(
	props: VistaAdminListaPuntuacionesProps
): JSX.Element {
	useEffect(() => {}, [props.partido]);

	return (
		<>
			<IonRow>
				<IonCol>
					<IonRow style={{ justifyContent: "center" }}>
						<IonLabel>{props.partido.local.nombre}</IonLabel>
					</IonRow>
					{props.partido.alineacionLocal.jugadoresTitulares.map((j) => (
						<VistaAdminPuntuacionJugador
							key={j._id}
							jugador={j}
							jornada={props.jornada}
							rival={props.partido.visitante.nombre}
							setPuntuacionesCambiadas={props.setPuntuacionesCambiadas}
							partido={props.partido}
							titular={true}
							guardarPuntuaciones={props.guardarPuntuaciones}
						/>
					))}
					<IonRow style={{ justifyContent: "center" }}>
						<IonLabel>{"Suplentes " + props.partido.local.nombre}</IonLabel>
					</IonRow>
					{props.partido.alineacionLocal.jugadoresSuplentes.map((j) => (
						<VistaAdminPuntuacionJugador
							key={j._id}
							jugador={j}
							jornada={props.jornada}
							rival={props.partido.visitante.nombre}
							setPuntuacionesCambiadas={props.setPuntuacionesCambiadas}
							partido={props.partido}
							titular={false}
							guardarPuntuaciones={props.guardarPuntuaciones}
						/>
					))}
				</IonCol>
				<IonCol>
					<IonRow style={{ justifyContent: "center" }}>
						<IonLabel>{props.partido.visitante.nombre}</IonLabel>
					</IonRow>

					{props.partido.alineacionVisitante.jugadoresTitulares.map((j) => (
						<VistaAdminPuntuacionJugador
							key={j._id}
							jugador={j}
							jornada={props.jornada}
							rival={props.partido.local.nombre}
							setPuntuacionesCambiadas={props.setPuntuacionesCambiadas}
							partido={props.partido}
							titular={true}
							guardarPuntuaciones={props.guardarPuntuaciones}
						/>
					))}
					<IonRow style={{ justifyContent: "center" }}>
						<IonLabel>{"Suplentes " + props.partido.visitante.nombre}</IonLabel>
					</IonRow>
					{props.partido.alineacionVisitante.jugadoresSuplentes.map((j) => (
						<VistaAdminPuntuacionJugador
							key={j._id}
							jugador={j}
							jornada={props.jornada}
							rival={props.partido.local.nombre}
							setPuntuacionesCambiadas={props.setPuntuacionesCambiadas}
							partido={props.partido}
							titular={false}
							guardarPuntuaciones={props.guardarPuntuaciones}
						/>
					))}
				</IonCol>
			</IonRow>
		</>
	);
}
