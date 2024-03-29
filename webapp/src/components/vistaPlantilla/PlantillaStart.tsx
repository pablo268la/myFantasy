import "swiper/css";
import "swiper/css/effect-fade";

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
    useIonToast
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { getJugadorById } from "../../endpoints/jugadorEndpoints";
import { getPlantilla } from "../../endpoints/plantillaEndpoints";
import {
    getColorGradient,
    getUsuarioLogueado,
    ponerPuntosAValor
} from "../../helpers/helpers";
import { Jugador, PlantillaUsuario } from "../../shared/sharedTypes";

import { Icon } from "@iconify/react";
import "@ionic/react/css/ionic-swiper.css";
import styled from "styled-components";
import SwiperCore, { EffectFade, Mousewheel, Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import CartaJugador from "./vistaPlantillaNormal/CartaJugador";

const MyGrid = styled(IonGrid)`
	--ion-grid-columns: 12;
`;

SwiperCore.use([Mousewheel, Pagination]);
export function PlantillaStart(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(true);
	const [jugadores, setJugadores] = useState<Jugador[]>([]);
	const [reachEnd, setReachEnd] = useState<boolean>(false);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	async function getJugadores() {
		setLoading(true);
		const jugadores: Jugador[] = [];

		let p: any = null;
		await getPlantilla(
			window.location.pathname.split("/")[3],
			getUsuarioLogueado()?.id as string
		)
			.then((res) => {
				p = res;
			})
			.catch((err) => {
				crearToast(err.message, true, "danger");
			});

		const plantilla = p as PlantillaUsuario;

		for (let i = 0; i < plantilla.alineacionJugador.delanteros.length; i++) {
			await getJugadorById(plantilla.alineacionJugador.delanteros[i].jugador.id)
				.then((res) => jugadores.push(res))
				.catch((err) => {
					crearToast(err.message, true, "danger");
				});
		}
		for (let i = 0; i < plantilla.alineacionJugador.medios.length; i++) {
			await getJugadorById(plantilla.alineacionJugador.medios[i].jugador.id)
				.then((res) => jugadores.push(res))
				.catch((err) => {
					crearToast(err.message, true, "danger");
				});
		}
		for (let i = 0; i < plantilla.alineacionJugador.defensas.length; i++) {
			await getJugadorById(plantilla.alineacionJugador.defensas[i].jugador.id)
				.then((res) => jugadores.push(res))
				.catch((err) => {
					crearToast(err.message, true, "danger");
				});
		}
		for (let i = 0; i < plantilla.alineacionJugador.porteros.length; i++) {
			await getJugadorById(plantilla.alineacionJugador.porteros[i].jugador.id)
				.then((res) => jugadores.push(res))
				.catch((err) => {
					crearToast(err.message, true, "danger");
				});
		}

		await setJugadores(jugadores);
		setLoading(false);
	}

	useEffect(() => {
		getJugadores().catch((err) => {
			crearToast(err.message, true, "danger");
		});
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
					onReachEnd={() => {
						setReachEnd(true);
					}}
					modules={[EffectFade]}
					//effect="fade"
				>
					{jugadores.map((jugador) => (
						<>
							<SwiperSlide
								key={jugador.id}
								style={{
									background: getColorGradient(jugador.posicion),
								}}
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
					{reachEnd ? (
						<IonRouterLink href={"plantilla/" + getUsuarioLogueado()?.id}>
							<IonButton>Continuar</IonButton>
						</IonRouterLink>
					) : (
						<>
							<Icon
								icon="material-symbols:swipe-rounded"
								color="#dedede"
								height="72"
							/>
						</>
					)}
				</IonRow>
			</IonContent>
		</IonPage>
	) : (
		<IonProgressBar type="indeterminate"></IonProgressBar>
	);
}
