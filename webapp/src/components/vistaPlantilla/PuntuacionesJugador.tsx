import {
	IonCard,
	IonCol,
	IonContent,
	IonItem,
	IonLabel,
	IonList,
	IonRow,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { getPuntuacionJugador } from "../../endpoints/puntuacionesController";
import {
	PropiedadJugador,
	PuntuacionJugador,
	PuntuacionTupple,
} from "../../shared/sharedTypes";

import styled from "styled-components";
import "swiper/swiper-bundle.min.css";

import "swiper/swiper.min.css";

const RedIonRow = styled(IonRow)`
	justify-content: center;
	align-content: center;
	height: 50px;
	background: linear-gradient(160deg, #ff5454 60%, #a60707 60%);
`;

const YellowIonRow = styled(IonRow)`
	justify-content: center;
	background: linear-gradient(160deg, #fdcd3b 60%, #ffed4b 60%);
`;

const GreenIonRow = styled(IonRow)`
	justify-content: center;
	background: linear-gradient(160deg, #48fb63 60%, #0bd500 60%);
`;

type PuntuacionesJugadorProps = {
	jugador: PropiedadJugador;
};

export function PuntuacionesJugador(
	props: PuntuacionesJugadorProps
): JSX.Element {
	const [puntuaciones, setPuntuaciones] = useState<PuntuacionJugador[]>([]);

	useEffect(() => {
		getPuntuacionJugador(props.jugador.jugador).then((p) => {
			setPuntuaciones(p);
		});
	}, []);

	const sliderRef = useRef<SwiperRef>(null);

	const [selectedPos, setSelectedPos] = useState<number>(0);

	return (
		<>
			<IonRow>
				<IonCol sizeXs="3">
					<IonList style={{ height: "100%" }}>
						<IonContent>
							{puntuaciones.map((p) => {
								return (
									<>
										<IonCard
											key={p.semana}
											onClick={() => {
												sliderRef?.current?.swiper.slideTo(p.semana - 1);
												setSelectedPos(p.semana - 1);
											}}
											color={
												p.semana - 1 === selectedPos ? "primary" : "secondary"
											}
										>
											{p.puntos < 4 ? (
												<RedIonRow>
													<IonLabel> {p.puntos}</IonLabel>
												</RedIonRow>
											) : p.puntos < 8 ? (
												<YellowIonRow>
													<IonLabel>{p.puntos}</IonLabel>
												</YellowIonRow>
											) : (
												<GreenIonRow>
													<IonLabel>{p.puntos}</IonLabel>
												</GreenIonRow>
											)}
											<IonRow style={{ justifyContent: "center" }}>
												<IonLabel>J{p.semana}</IonLabel>
											</IonRow>
										</IonCard>
									</>
								);
							})}
						</IonContent>
					</IonList>
				</IonCol>
				<IonCol sizeXs="8">
					<Swiper
						ref={sliderRef}
						onSlideChange={(swiper) => {
							setSelectedPos(swiper.activeIndex);
						}}
						style={{
							border: "2px solid #123445",
							maxWidth: 800,
							height: 600,
						}}
					>
						{puntuaciones.map((p) => {
							return (
								<>
									<SwiperSlide key={p.semana - 1}>
										<IonContent>
											<IonRow style={{ justifyContent: "center" }}>
												<IonItem lines="none">
													<IonLabel>{props.jugador.jugador.nombre}</IonLabel>
												</IonItem>
											</IonRow>
											<IonItem>
												<IonLabel>Puntos {p.puntos}</IonLabel>
												<IonLabel slot="end">Jornada {p.semana}</IonLabel>
											</IonItem>
											<IonItem>Puntuacion básica</IonItem>
											{crearItem(
												p.idJugador,
												p.puntuacionBasica.valoracion,
												"Valoracion"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionBasica.goles,
												"Goles"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionBasica.asistencias,
												"Asistencias"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionBasica.minutos,
												"Minutos"
											)}

											<IonItem>Puntuacion ofensiva</IonItem>

											{crearItem(
												p.idJugador,
												p.puntuacionOfensiva.tirosPuerta,
												"Tiros a puerta"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionOfensiva.tirosFuera,
												"Tiros fuera"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionOfensiva.tirosBloqueados,
												"Tiros bloqueados"
											)}

											{crearItem(
												p.idJugador,
												p.puntuacionOfensiva.regatesCompletados,
												"Regates completados"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionOfensiva.ocasionClaraFallada,
												"Ocasiones falladas"
											)}

											<IonItem> Puntuacion posesiva</IonItem>

											{crearItem(
												p.idJugador,
												p.puntuacionPosesion.pasesClave,
												"Pases clave"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionPosesion.centrosCompletados,
												"Centros completados"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionPosesion.grandesOcasiones,
												"Grandes ocasiones creadas"
											)}

											{crearItem(
												p.idJugador,
												p.puntuacionPosesion.pasesTotales,
												"Pases totales"
											)}

											<IonItem>Puntuacion defensiva</IonItem>
											{crearItem(
												p.idJugador,
												p.puntuacionDefensiva.despejes,
												"Despejes"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionDefensiva.entradas,
												"Entradas"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionDefensiva.intercepciones,
												"Intercepciones"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionDefensiva.tirosBloqueados,
												"Tiros bloqueados"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionDefensiva.erroresParaDisparo,
												"Errores para disparo"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionDefensiva.golesEnPropia,
												"Goles en propia"
											)}
											<IonItem>Puntuacion fisica</IonItem>
											{crearItem(
												p.idJugador,
												p.puntuacionFisico.faltasCometidas,
												"Faltas cometidas"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionFisico.faltasRecibidas,
												"Faltas recibidas"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionFisico.duelosGanados,
												"Duelos ganados"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionFisico.duelosPerdidos,
												"Duelos perdidos"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionFisico.posesionPerdida,
												"Posesion perdida"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionFisico.fuerasDeJuego,
												"Fueras de juego"
											)}

											<IonItem>Puntuacion portero</IonItem>
											{crearItem(
												p.idJugador,
												p.puntuacionPortero.paradas,
												"Paradas"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionPortero.despejes,
												"Despejes"
											)}
											{crearItem(
												p.idJugador,
												p.puntuacionPortero.salidas,
												"Salidas"
											)}
										</IonContent>
									</SwiperSlide>
								</>
							);
						})}
					</Swiper>
				</IonCol>
			</IonRow>
		</>
	);
}

export function crearItem(
	idJugador: string,
	puntuacionTupple: PuntuacionTupple,
	label: string
) {
	return (
		<IonItem key={idJugador + "-" + label} lines="none">
			<IonCol size="2">{puntuacionTupple.estadistica}</IonCol>
			<IonCol size="8">
				<IonLabel>{label}</IonLabel>
			</IonCol>
			<IonCol size="2">{puntuacionTupple.puntos}</IonCol>
		</IonItem>
	);
}
