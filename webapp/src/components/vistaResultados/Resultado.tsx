import {
	IonAccordion,
	IonAccordionGroup,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCol,
	IonIcon,
	IonImg,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonRow,
} from "@ionic/react";
import {
	arrowForwardCircle,
	copy,
	football,
	square,
	swapHorizontal,
} from "ionicons/icons";
import { ReactComponentElement, useEffect, useState } from "react";
import { getPuntuacionesPartido } from "../../endpoints/partidosController";
import { Partido, PuntuacionJugador } from "../../shared/sharedTypes";

type ResultadoProps = {
	partido: Partido;
};

export function Resultados(props: ResultadoProps): JSX.Element {
	const [puntuaciones, setPuntuaciones] = useState<PuntuacionJugador[]>([]);

	useEffect(() => {
		getPuntuacionesPartido(props.partido._id).then((puntuaciones) => {
			setPuntuaciones(puntuaciones);
		});
	}, []);

	return (
		<>
			<IonCard>
				<IonCardHeader>
					<IonRow className="ion-justify-content-center">
						<IonImg src={props.partido.local.escudo} style={{ width: 30 }} />
						<h5>
							{props.partido.local.nombre} {props.partido.resultadoLocal}-{" "}
							{props.partido.resultadoVisitante}{" "}
							{props.partido.visitante.nombre}
						</h5>
						<IonImg
							src={props.partido.visitante.escudo}
							style={{ width: 30 }}
						/>
					</IonRow>
				</IonCardHeader>
				<IonCardContent>
					<IonAccordionGroup>
						<IonAccordion value="first">
							<IonItem slot="header" color="light">
								<IonLabel>Ver puntos</IonLabel>
							</IonItem>
							<div className="ion-padding" slot="content">
								<IonRow>
									<IonCol sizeXs="6">
										{props.partido.alineacionLocal.jugadoresTitulares.map(
											(jugador) => (
												<IonItem>
													<IonImg src={jugador.foto} style={{ width: 30 }} />
													<IonLabel> {jugador.nombre}</IonLabel>
													{puntuaciones
														.filter((p) => p.idJugador === jugador._id)
														.map((p) => (
															<>{getIconosPuntuaciones(p, true)}</>
														))}
													<IonLabel slot="end">
														{puntuaciones
															.filter((p) => p.idJugador === jugador._id)
															.map((p) => p.puntos)}
													</IonLabel>
												</IonItem>
											)
										)}
										<IonItemDivider />
										{props.partido.alineacionLocal.jugadoresSuplentes.map(
											(jugador) => (
												<IonItem>
													<IonImg src={jugador.foto} style={{ width: 30 }} />
													<IonLabel> {jugador.nombre}</IonLabel>
													{puntuaciones
														.filter((p) => p.idJugador === jugador._id)
														.map((p) => (
															<>{getIconosPuntuaciones(p, false)}</>
														))}
													<IonLabel slot="end">
														{puntuaciones
															.filter((p) => p.idJugador === jugador._id)
															.map((p) => p.puntos)}
													</IonLabel>
												</IonItem>
											)
										)}
									</IonCol>
									<IonCol sizeXs="6">
										{props.partido.alineacionVisitante.jugadoresTitulares.map(
											(jugador) => (
												<IonItem>
													<IonImg src={jugador.foto} style={{ width: 30 }} />
													<IonLabel> {jugador.nombre}</IonLabel>
													{puntuaciones
														.filter((p) => p.idJugador === jugador._id)
														.map((p) => (
															<>{getIconosPuntuaciones(p, true)}</>
														))}
													<IonLabel slot="end">
														{puntuaciones
															.filter((p) => p.idJugador === jugador._id)
															.map((p) => p.puntos)}
													</IonLabel>
												</IonItem>
											)
										)}
										<IonItemDivider />
										{props.partido.alineacionVisitante.jugadoresSuplentes.map(
											(jugador) => (
												<IonItem>
													<IonImg src={jugador.foto} style={{ width: 30 }} />
													<IonLabel> {jugador.nombre}</IonLabel>
													{puntuaciones
														.filter((p) => p.idJugador === jugador._id)
														.map((p) => (
															<>{getIconosPuntuaciones(p, false)}</>
														))}
													<IonLabel slot="end">
														{puntuaciones
															.filter((p) => p.idJugador === jugador._id)
															.map((p) => p.puntos)}
													</IonLabel>
												</IonItem>
											)
										)}
									</IonCol>
								</IonRow>
							</div>
						</IonAccordion>
					</IonAccordionGroup>
				</IonCardContent>
			</IonCard>
		</>
	);
}

function getIconosPuntuaciones(p: PuntuacionJugador, titular: boolean) {
	return (
		<>
			{p.puntuacionBasica.goles.estadistica > 0 ? (
				<>
					{repeatIcon(
						<IonIcon icon={football} />,
						p.puntuacionBasica.goles.estadistica
					)}
				</>
			) : (
				<></>
			)}
			{p.puntuacionDefensiva.golesEnPropia.estadistica > 0 ? (
				<>
					{repeatIcon(
						<IonIcon color={"danger"} icon={football} />,
						p.puntuacionDefensiva.golesEnPropia.estadistica
					)}
				</>
			) : (
				<></>
			)}
			{p.puntuacionCalculable &&
			p.puntuacionCalculable.tarjetasAmarilla.estadistica > 0 ? (
				<IonIcon color={"warning"} icon={square} />
			) : (
				<></>
			)}
			{p.puntuacionCalculable &&
			p.puntuacionCalculable.tarjetasRoja.estadistica > 0 ? (
				<IonIcon color={"danger"} icon={square} />
			) : (
				<></>
			)}
			{p.puntuacionCalculable &&
			p.puntuacionCalculable.dobleAmarilla.estadistica > 0 ? (
				<IonIcon color={"warning"} icon={copy} />
			) : (
				<></>
			)}
			{p.puntuacionBasica.asistencias.estadistica > 0 ? (
				<>
					{repeatIcon(
						<IonIcon color={"success"} icon={arrowForwardCircle} />,
						p.puntuacionBasica.asistencias.estadistica
					)}
				</>
			) : (
				<></>
			)}
			{getLogInOrLogOut(p, titular)}
		</>
	);
}

function repeatIcon(r: ReactComponentElement<any>, n: number) {
	let result = [];
	for (let i = 0; i < n; i++) {
		result.push(r);
	}
	return result;
}

function getLogInOrLogOut(p: PuntuacionJugador, titular: boolean) {
	if (p.puntuacionBasica.minutos.estadistica > 0 && !titular) {
		return <IonIcon color={"success"} icon={swapHorizontal} />;
	} else if (
		p.puntuacionBasica.minutos.estadistica < 90 &&
		titular &&
		p.puntuacionCalculable.dobleAmarilla.estadistica === 0 &&
		p.puntuacionCalculable.tarjetasRoja.estadistica === 0
	) {
		return <IonIcon color={"danger"} icon={swapHorizontal} />;
	} else {
		return <></>;
	}
}
