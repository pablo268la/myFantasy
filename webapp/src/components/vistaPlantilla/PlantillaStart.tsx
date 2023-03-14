import {
	IonButton,
	IonContent,
	IonGrid,
	IonImg,
	IonLabel,
	IonPage,
	IonProgressBar,
	IonRouterLink,
	IonRow,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { getJugadorById } from "../../endpoints/jugadorEndpoints";
import { getPlantilla } from "../../endpoints/plantillaEndpoints";
import {
	getColorBadge,
	getUsuarioLogueado,
	ponerPuntosAValor,
} from "../../helpers/helpers";
import { Jugador, PlantillaUsuario } from "../../shared/sharedTypes";

import "@ionic/react/css/ionic-swiper.css";
import styled from "styled-components";
import SwiperCore, { Mousewheel, Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import CartaJugador from "./vistaPlantillaNormal/CartaJugador";

const MyGrid = styled(IonGrid)`
	--ion-grid-columns: 12;
`;

SwiperCore.use([Mousewheel, Pagination]);
export function PlantillaStart(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(true);
	const [idLiga, setIdLiga] = useState<string>("");
	const [jugadores, setJugadores] = useState<Jugador[]>([]);

	async function getJugadores() {
		setLoading(true);
		const jugadores: Jugador[] = [];
		const plantilla: PlantillaUsuario = await getPlantilla(
			window.location.pathname.split("/")[3],
			getUsuarioLogueado()?.id as string
		);

		setIdLiga(plantilla.idLiga);

		for (let i = 0; i < plantilla.alineacionJugador.delanteros.length; i++) {
			const jugador = await getJugadorById(
				plantilla.alineacionJugador.delanteros[i].jugador._id
			);
			jugadores.push(jugador);
		}
		for (let i = 0; i < plantilla.alineacionJugador.medios.length; i++) {
			const jugador = await getJugadorById(
				plantilla.alineacionJugador.medios[i].jugador._id
			);
			jugadores.push(jugador);
		}
		for (let i = 0; i < plantilla.alineacionJugador.defensas.length; i++) {
			const jugador = await getJugadorById(
				plantilla.alineacionJugador.defensas[i].jugador._id
			);
			jugadores.push(jugador);
		}
		for (let i = 0; i < plantilla.alineacionJugador.porteros.length; i++) {
			const jugador = await getJugadorById(
				plantilla.alineacionJugador.porteros[i].jugador._id
			);
			jugadores.push(jugador);
		}

		setJugadores(jugadores);
		setLoading(false);
	}

	useEffect(() => {
		getJugadores();
	}, []);

	return !loading ? (
		<IonPage>
			<IonContent style={{ justifyContent: "center" }}>
				<Swiper
					onSlideChange={() => {}}
					style={{ border: "2px solid #123445", maxWidth: 800, height: "85%" }}
					pagination={{
						clickable: true,
					}}
				>
					{jugadores.map((jugador) => (
						<>
							<SwiperSlide
								key={jugador._id}
								style={{ background: getColorBadge(jugador.posicion) }}
							>
								<IonGrid>
									<IonRow style={{ justifyContent: "center" }}>
										<IonLabel style={{ color: "#ffffff", fontSize: "30px" }}>
											{jugador.posicion.toUpperCase()}
										</IonLabel>
									</IonRow>
									<IonRow style={{ justifyContent: "center", margin: 30 }}>
										<IonImg
											style={{ minHeight: "200px", minWidth: "200px" }}
											src={jugador.foto}
										></IonImg>
									</IonRow>
									<IonRow
										style={{
											marginTop: 10,
											justifyContent: "space-around",
											alignContent: "center",
										}}
									>
										<IonLabel style={{ color: "#ffffff" }}>
											{jugador.nombre}
										</IonLabel>
										<IonLabel style={{ color: "#ffffff" }}>
											{ponerPuntosAValor(jugador.valor)}
										</IonLabel>
									</IonRow>
								</IonGrid>
							</SwiperSlide>
						</>
					))}
					<SwiperSlide key="resumeSlide" style={{ background: "#562765" }}>
						<MyGrid>
							<IonRow style={{ justifyContent: "center" }}>
								{jugadores.map((jugador) => (
									<>
										<CartaJugador
											jugador={{
												jugador: jugador,
												titular: false,
												usuario: getUsuarioLogueado() as any,
												venta: {
													enVenta: false,
													ofertas: [],
													fechaLimite: "",
												},
											}}
											posicion={jugador.posicion}
											setJugadorPulsado={() => {}}
											xsSize={3}
										/>
									</>
								))}
							</IonRow>
							<IonRow style={{ justifyContent: "center" }}>
								<IonLabel style={{ color: "#ffffff" }}>
									Valor total:{"  "}
									{ponerPuntosAValor(
										jugadores.map((j) => j.valor).reduce((a, b) => a + b, 0)
									)}
								</IonLabel>
							</IonRow>
						</MyGrid>
					</SwiperSlide>
				</Swiper>
				<IonRow style={{ justifyContent: "center" }}>
					<IonRouterLink href={"plantilla/" + getUsuarioLogueado()?.id}>
						<IonButton>Continuar</IonButton>
					</IonRouterLink>
				</IonRow>
			</IonContent>
		</IonPage>
	) : (
		<IonProgressBar type="indeterminate"></IonProgressBar>
	);
}
