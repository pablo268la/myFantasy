import {
	IonAccordion,
	IonAccordionGroup,
	IonCard,
	IonCol,
	IonContent,
	IonItem,
	IonLabel,
	IonList,
	IonProgressBar,
	IonRow,
} from "@ionic/react";
import { useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
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
	height: 30px;
	background: linear-gradient(160deg, #ff5454 60%, #a60707 60%);
`;

const YellowIonRow = styled(IonRow)`
	justify-content: center;
	align-content: center;
	height: 30px;
	background: linear-gradient(160deg, #fdcd3b 60%, #ffed4b 60%);
`;

const GreenIonRow = styled(IonRow)`
	justify-content: center;
	align-content: center;
	height: 30px;
	background: linear-gradient(160deg, #48fb63 60%, #0bd500 60%);
`;

type PuntuacionesJugadorProps = {
	jugador: PropiedadJugador;
	jornada: number;
	puntuaciones: PuntuacionJugador[];
};

export function PuntuacionesJugador(
	props: PuntuacionesJugadorProps
): JSX.Element {
	//	const [puntuaciones, setPuntuaciones] = useState<PuntuacionJugador[]>();

	/*useEffect(() => {
		getPuntuacionJugador(props.jugador.jugador).then((p) => {
			setPuntuaciones(p);
		});
	}, []);*/

	const sliderRef = useRef<SwiperRef>(null);

	const [selectedPos, setSelectedPos] = useState<number>(props.jornada - 1);

	return (
		<>
			{props.puntuaciones ? (
				<IonRow>
					<IonCol sizeXs="3">
						<IonList style={{ height: "100%" }}>
							<IonContent>
								{props.puntuaciones.map((p) => {
									return (
										<>
											<IonCard
												key={p.semana}
												onClick={() => {
													sliderRef?.current?.swiper.slideTo(p.semana - 1);
													setSelectedPos(p.semana - 1);
												}}
												color={
													p.semana - 1 === selectedPos ? "primary" : "tertiary"
												}
											>
												{p.puntos < 4 ? (
													<RedIonRow>
														<IonLabel> {p.puntos}</IonLabel>
													</RedIonRow>
												) : p.puntos < 12 ? (
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
					<IonCol sizeXs="9">
						<Swiper
							initialSlide={selectedPos}
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
							{props.puntuaciones.map((p) => {
								return (
									<>
										<SwiperSlide key={p.semana - 1}>
											<IonContent>
												<IonRow style={{ justifyContent: "center" }}>
													<IonItem key={-1} lines="none">
														<IonLabel>{props.jugador.jugador.nombre}</IonLabel>
													</IonItem>
												</IonRow>
												<IonItem key={-2}>
													<IonLabel>Puntos {p.puntos}</IonLabel>
													<IonLabel slot="end">Jornada {p.semana}</IonLabel>
												</IonItem>
												<IonAccordionGroup value="first">
													<IonAccordion value="first" toggleIconSlot="start">
														<IonItem slot="header" color="light">
															<IonLabel>Puntuacion basica</IonLabel>
														</IonItem>
														<div className="ion-padding" slot="content">
															{crearItem(
																p.idJugador,
																p.puntuacionBasica.valoracion,
																"Valoracion",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionBasica.minutos,
																"Minutos",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionBasica.goles,
																"Goles",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionBasica.asistencias,
																"Asistencias",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionCalculable.golesRecibidos,
																"Goles recibidos",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionCalculable.tarjetasAmarilla,
																"Tarjetas amarillas",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionCalculable.dobleAmarilla,
																"Doble amarilla",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionCalculable.tarjetasRoja,
																"Tarjetas rojas",
																p.semana
															)}
														</div>
													</IonAccordion>
												</IonAccordionGroup>
												<IonAccordionGroup value="first">
													<IonAccordion value="first" toggleIconSlot="start">
														<IonItem slot="header" color="light">
															<IonLabel>Puntuacion ofensiva</IonLabel>
														</IonItem>
														<div className="ion-padding" slot="content">
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.tirosPuerta,
																"Tiros a puerta",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.tirosFuera,
																"Tiros fuera",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.tirosBloqueados,
																"Tiros rechazados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.tirosAlPalo,
																"Tiros al palo",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.regatesIntentados,
																"Regates intentados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.regatesCompletados,
																"Regates completados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.ocasionClaraFallada,
																"Ocasiones falladas",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.penaltiFallado,
																"Penalti recibido",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionOfensiva.penaltiFallado,
																"Penalti fallado",
																p.semana
															)}
														</div>
													</IonAccordion>
												</IonAccordionGroup>
												<IonAccordionGroup value="first">
													<IonAccordion value="first" toggleIconSlot="start">
														<IonItem slot="header" color="light">
															<IonLabel>Puntuacion posesiva</IonLabel>
														</IonItem>
														<div className="ion-padding" slot="content">
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.toquesBalon,
																"Toques de balon",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.pasesTotales,
																"Pases totales",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.pasesCompletados,
																"Pases completados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.pasesClave,
																"Pases clave",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.centrosTotales,
																"Centros totales",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.centrosCompletados,
																"Centros completados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.pasesLargosTotales,
																"Pases largos totales",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.pasesLargosCompletados,
																"Pases largos completados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPosesion.grandesOcasiones,
																"Grandes ocasiones creadas",
																p.semana
															)}
														</div>
													</IonAccordion>
												</IonAccordionGroup>
												<IonAccordionGroup value="first">
													<IonAccordion value="first" toggleIconSlot="start">
														<IonItem slot="header" color="light">
															<IonLabel>Puntuacion defensiva</IonLabel>
														</IonItem>
														<div className="ion-padding" slot="content">
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.despejes,
																"Despejes",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.entradas,
																"Entradas",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.intercepciones,
																"Intercepciones",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.tirosBloqueados,
																"Tiros bloqueados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.erroresParaDisparo,
																"Errores para disparo",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.golesEnPropia,
																"Goles en propia",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.despejesEnLineaDeGol,
																"Despejes en linea de gol",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.regatesSuperado,
																"Regateado",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionDefensiva.penaltiCometido,
																"Penalti cometido",
																p.semana
															)}
														</div>
													</IonAccordion>
												</IonAccordionGroup>
												<IonAccordionGroup value="first">
													<IonAccordion value="first" toggleIconSlot="start">
														<IonItem slot="header" color="light">
															<IonLabel>Puntuacion fisica</IonLabel>
														</IonItem>
														<div className="ion-padding" slot="content">
															{crearItem(
																p.idJugador,
																p.puntuacionFisico.faltasCometidas,
																"Faltas cometidas",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionFisico.faltasRecibidas,
																"Faltas recibidas",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionFisico.duelosGanados,
																"Duelos ganados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionFisico.duelosPerdidos,
																"Duelos perdidos",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionFisico.duelosAereosGanados,
																"Duelos aereos ganados",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionFisico.duelosAereosPerdidos,
																"Duelos aereos perdidos",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionFisico.posesionPerdida,
																"Posesion perdida",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionFisico.fuerasDeJuego,
																"Fueras de juego",
																p.semana
															)}
														</div>
													</IonAccordion>
												</IonAccordionGroup>
												<IonAccordionGroup value="first">
													<IonAccordion value="first" toggleIconSlot="start">
														<IonItem slot="header" color="light">
															<IonLabel>Puntuacion portero</IonLabel>
														</IonItem>
														<div className="ion-padding" slot="content">
															{crearItem(
																p.idJugador,
																p.puntuacionPortero.paradas,
																"Paradas",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPortero.despejes,
																"Despejes",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPortero.salidas,
																"Salidas",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPortero.highClaim,
																"Salidas por alto",
																p.semana
															)}
															{crearItem(
																p.idJugador,
																p.puntuacionPortero.penaltiesParados,
																"Penaltis parados",
																p.semana
															)}
														</div>
													</IonAccordion>
												</IonAccordionGroup>
											</IonContent>
										</SwiperSlide>
									</>
								);
							})}
						</Swiper>
					</IonCol>
				</IonRow>
			) : (
				<>
					<IonProgressBar type="indeterminate"></IonProgressBar>
				</>
			)}
		</>
	);
}

export function crearItem(
	idJugador: string,
	puntuacionTupple: PuntuacionTupple,
	label: string,
	semana: number
) {
	return (
		<IonItem key={idJugador + "-" + label + "-" + semana} lines="none">
			<IonCol size="2">{puntuacionTupple.estadistica}</IonCol>
			<IonCol size="8">
				<IonLabel>{label}</IonLabel>
			</IonCol>
			<IonCol size="2">{puntuacionTupple.puntos}</IonCol>
		</IonItem>
	);
}
