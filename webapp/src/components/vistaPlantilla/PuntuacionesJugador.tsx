import {
	IonCard,
	IonCol,
	IonContent,
	IonItem,
	IonLabel,
	IonList,
	IonRow
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

const RedIonLabel = styled(IonLabel)`
	background: linear-gradient(110deg, #ff5454 60%, #a60707 60%);
`;

const YellowIonLabel = styled(IonLabel)`
	background: linear-gradient(110deg, #fdcd3b 60%, #ffed4b 60%);
`;

const GreenIonLabel = styled(IonLabel)`
	background: linear-gradient(110deg, #48fb63 60%, #0bd500 60%);
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
			<IonRow style={{ justifyContent: "center" }}>
				<IonLabel>{props.jugador.jugador.nombre}</IonLabel>
			</IonRow>
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
											<IonItem lines="none">
												{p.puntos < 4 ? (
													<RedIonLabel>{p.puntos}</RedIonLabel>
												) : p.puntos < 8 ? (
													<YellowIonLabel>{p.puntos}</YellowIonLabel>
												) : (
													<GreenIonLabel>{p.puntos}</GreenIonLabel>
												)}
											</IonItem>

										
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
						pagination={{
							clickable: true,
						}}
					>
						{puntuaciones.map((p) => {
							return (
								<>
									<SwiperSlide key={p.semana - 1}>
										<IonContent>
											<IonItem>
												<IonLabel>{p.puntos}</IonLabel>
											</IonItem>
											<IonItem>Puntuacion básica</IonItem>
											{crearItem(p.puntuacionBasica.valoracion, "Valoracion")}
											{crearItem(p.puntuacionBasica.goles, "Goles")}
											{crearItem(p.puntuacionBasica.asistencias, "Asistencias")}
											{crearItem(p.puntuacionBasica.minutos, "Minutos")}

											<IonItem>Puntuacion ofensiva</IonItem>

											{crearItem(
												p.puntuacionOfensiva.tirosPuerta,
												"Tiros a puerta"
											)}
											{crearItem(
												p.puntuacionOfensiva.tirosFuera,
												"Tiros fuera"
											)}
											{crearItem(
												p.puntuacionOfensiva.tirosBloqueados,
												"Tiros bloqueados"
											)}

											{crearItem(
												p.puntuacionOfensiva.regatesCompletados,
												"Regates completados"
											)}
											{crearItem(
												p.puntuacionOfensiva.ocasionClaraFallada,
												"Ocasiones falladas"
											)}

											<IonItem> Puntuacion posesiva</IonItem>

											{crearItem(
												p.puntuacionPosesion.pasesClave,
												"Pases clave"
											)}
											{crearItem(
												p.puntuacionPosesion.centrosCompletados,
												"Centros completados"
											)}
											{crearItem(
												p.puntuacionPosesion.grandesOcasiones,
												"Grandes ocasiones creadas"
											)}

											{crearItem(
												p.puntuacionPosesion.pasesTotales,
												"Pases totales"
											)}

											<IonItem>Puntuacion defensiva</IonItem>
											{crearItem(p.puntuacionDefensiva.despejes, "Despejes")}
											{crearItem(p.puntuacionDefensiva.entradas, "Entradas")}
											{crearItem(
												p.puntuacionDefensiva.intercepciones,
												"Intercepciones"
											)}
											{crearItem(
												p.puntuacionDefensiva.tirosBloqueados,
												"Tiros bloqueados"
											)}
											{crearItem(
												p.puntuacionDefensiva.erroresParaDisparo,
												"Errores para disparo"
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

export function crearItem(puntuacionTupple: PuntuacionTupple, label: string) {
	return (
		<IonItem lines="none">
			<IonCol size="2">{puntuacionTupple.estadistica}</IonCol>
			<IonCol size="8">
				<IonLabel>{label}</IonLabel>
			</IonCol>
			<IonCol size="2">{puntuacionTupple.puntos}</IonCol>
		</IonItem>
	);
}
