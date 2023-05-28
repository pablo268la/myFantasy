import {
	IonActionSheet,
	IonBadge,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonGrid,
	IonImg,
	IonInput,
	IonItem,
	IonLabel,
	IonPopover,
	IonRow,
	IonText,
	useIonToast,
} from "@ionic/react";
import { cart, close, pencil, trash } from "ionicons/icons";
import { useEffect, useState } from "react";
import {
	eliminaPujaDelMercado,
	eliminarJugadorDelMercado,
	hacerPuja,
} from "../../endpoints/mercadoEndpoints";
import {
	getColorBadge,
	getUsuarioLogueado,
	ponerPuntosAValor,
	urlBackground,
} from "../../helpers/helpers";
import { Oferta, PropiedadJugador } from "../../shared/sharedTypes";

type CartaJugadorMercadoProps = {
	propiedadJugadorEnVenta: PropiedadJugador;
	idLiga: string;
	resetMercado: () => Promise<void>;
	reseteandoMercado: boolean;
	actualizarMercado: () => Promise<void>;
	setShowLoading: (show: boolean) => void;
	setLoadingMessage: (message: string) => void;
};

export function CartaJugadorMercado(
	props: CartaJugadorMercadoProps
): JSX.Element {
	const [tiempoRestante, setTiempoRestante] = useState<string>("");

	const [propiedadJugadorEnVenta, setPropiedadJugadorEnVenta] =
		useState<PropiedadJugador>(props.propiedadJugadorEnVenta);

	const [puja, setPuja] = useState<number>(
		props.propiedadJugadorEnVenta.jugador.valor
	);

	const [showActionSheet, setShowActionSheet] = useState(false);
	const [showPopover, setShowPopover] = useState(false);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	var x = setInterval(async function () {
		const countDownDate = new Date(
			propiedadJugadorEnVenta.venta.fechaLimite
		).getTime();
		// Get today's date and time
		var now = new Date().getTime();

		// Find the distance between now and the count down date
		var distance = countDownDate - now;

		if (distance < 0) {
			clearInterval(x);
			setTiempoRestante("EXPIRED");
			if (!props.reseteandoMercado) await props.resetMercado();
			return;
		} else {
			// Time calculations for days, hours, minutes and seconds
			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			setTiempoRestante(
				(days === 0 ? "" : days + "d ") +
					hours +
					"h " +
					minutes +
					"m " +
					seconds +
					"s "
			);
		}
	}, 1000);

	const hacerPujaAlBack = async () => {
		let o: Oferta = {
			comprador: getUsuarioLogueado() as any,
			estado: "ACTIVA",
			privada: false,
			valorOferta: puja,
		};

		await hacerPuja(propiedadJugadorEnVenta, props.idLiga, o)
			.then((res) => {
				setPropiedadJugadorEnVenta(res);
			})
			.catch((err) => {
				crearToast(err.message, true, "danger");
			});
	};

	const hasPuja = () => {
		let p = propiedadJugadorEnVenta.venta.ofertas.filter((oferta) => {
			return getUsuarioLogueado()?.id === oferta.comprador.id;
		});
		return p.length > 0;
	};

	useEffect(() => {
		setPropiedadJugadorEnVenta(props.propiedadJugadorEnVenta);
	}, [props.propiedadJugadorEnVenta]);

	return (
		<>
			<IonCard>
				<IonCardContent>
					<IonGrid>
						<IonRow>
							<div
								style={{
									backgroundImage: urlBackground,
									maxWidth: 130,
									width: "50%",
								}}
							>
								<IonCol>
									<IonCardContent>
										<IonRow style={{ width: 110, height: 50 }}>
											<IonCol style={{ width: 70, height: 70 }}>
												<div
													style={{
														width: 90,
														height: 70,
														marginTop: -18,
														marginLeft: -8,
													}}
												>
													<IonImg src={propiedadJugadorEnVenta.jugador.foto} />
												</div>
											</IonCol>
											<IonCol>
												<div style={{ width: 30, height: 30, marginTop: -20 }}>
													<IonImg
														src={
															"https://api.sofascore.app/api/v1/team/" +
															propiedadJugadorEnVenta.jugador.equipo.id +
															"/image"
														}
													/>
												</div>
											</IonCol>
										</IonRow>
									</IonCardContent>
								</IonCol>
							</div>
							<IonCol>
								<IonItem color={"primary"}>
									<IonBadge
										style={{
											backgroundColor: getColorBadge(
												propiedadJugadorEnVenta.jugador.posicion
											),
										}}
									>
										{propiedadJugadorEnVenta.jugador.posicion
											.substring(0, 3)
											.toUpperCase()}
									</IonBadge>
									<IonLabel style={{ marginLeft: 10, color: "light" }}>
										{propiedadJugadorEnVenta.jugador.nombre}
									</IonLabel>
									<IonLabel slot="end">PTS:</IonLabel>
									<IonText slot="end">
										{propiedadJugadorEnVenta.jugador.puntos}
									</IonText>
								</IonItem>
								<IonRow>
									<IonLabel>
										Valor:{" "}
										{ponerPuntosAValor(propiedadJugadorEnVenta.jugador.valor)}
									</IonLabel>
								</IonRow>
								<IonRow>
									<IonLabel>
										Vendedor: {propiedadJugadorEnVenta.usuario.usuario}
									</IonLabel>
								</IonRow>
								<IonRow style={{ justifyContent: "space-between" }}>
									<IonLabel>Tiempo restante: {tiempoRestante}</IonLabel>
									{propiedadJugadorEnVenta.venta.ofertas.length > 0 ? (
										<IonLabel>
											Pujas: {propiedadJugadorEnVenta.venta.ofertas.length}
										</IonLabel>
									) : (
										<></>
									)}

									<IonButton
										onClick={() => {
											setShowActionSheet(true);
										}}
									>
										Opciones
									</IonButton>
									<IonActionSheet
										header={
											"¿Que quieres hacer con " +
											propiedadJugadorEnVenta.jugador.nombre +
											"?"
										}
										isOpen={showActionSheet}
										onDidDismiss={() => setShowActionSheet(false)}
										buttons={
											propiedadJugadorEnVenta.usuario.id ===
											getUsuarioLogueado()?.id
												? [
														{
															text: "Quitar del mercado",
															icon: cart,
															handler: async () => {
																props.setShowLoading(true);
																props.setLoadingMessage(
																	"Quitando al jugador del mercado..."
																);
																await eliminarJugadorDelMercado(
																	props.idLiga,
																	propiedadJugadorEnVenta.jugador.id
																)
																	.then(async () => {
																		await props.actualizarMercado().then(() => {
																			props.setShowLoading(false);
																			crearToast(
																				"Jugador eliminado del mercado con éxito",
																				true,
																				"success"
																			);
																		});
																	})
																	.catch((err) => {
																		props.setShowLoading(false);
																		crearToast(err.message, true, "danger");
																	});
															},
														},
														{
															text: "Cancelar",
															icon: close,
															handler: () => {},
														},
												  ]
												: hasPuja()
												? [
														{
															text: "Editar puja",
															icon: pencil,
															handler: () => {
																setShowPopover(true);
															},
														},
														{
															text: "Eliminar puja",
															icon: trash,
															handler: async () => {
																props.setShowLoading(true);
																props.setLoadingMessage("Eliminando puja...");
																await eliminaPujaDelMercado(
																	props.idLiga,
																	propiedadJugadorEnVenta.jugador.id
																)
																	.then(async () => {
																		await props.actualizarMercado().then(() => {
																			props.setShowLoading(false);
																			crearToast(
																				"Puja eliminada con éxito",
																				true,
																				"success"
																			);
																		});
																	})
																	.catch((err) => {
																		props.setShowLoading(false);
																		crearToast(err.message, true, "danger");
																	});
															},
														},
														{
															text: "Cancelar",
															icon: close,
															handler: () => {},
														},
												  ]
												: [
														{
															text: "Pujar",
															icon: cart,
															handler: () => {
																setShowPopover(true);
															},
														},
														{
															text: "Cancelar",
															icon: close,
															handler: () => {},
														},
												  ]
										}
									></IonActionSheet>
									<IonPopover
										isOpen={showPopover}
										onDidDismiss={() => setShowPopover(false)}
									>
										<IonContent>
											<IonItem fill="outline">
												<IonInput
													value={puja}
													type="number"
													min={propiedadJugadorEnVenta.jugador.valor}
													onIonInput={(e) => {
														setPuja(parseInt(e.detail.value!));
													}}
												></IonInput>
											</IonItem>
											<IonItem>
												<IonButton
													slot="start"
													onClick={() => setShowPopover(false)}
												>
													Cancelar
												</IonButton>
												<IonButton
													slot="end"
													onClick={async () => {
														if (puja < propiedadJugadorEnVenta.jugador.valor) {
															crearToast(
																"La puja debe ser mayor que el valor del jugador",
																true,
																"danger"
															);
															return;
														}
														props.setShowLoading(true);
														props.setLoadingMessage(
															"Moviendo los millones a la sede de la liga..."
														);
														await hacerPujaAlBack()
															.then(async () => {
																await props.actualizarMercado().then(() => {
																	props.setShowLoading(false);
																	crearToast(
																		"Puja realizada con éxito",
																		true,
																		"success"
																	);
																});
															})
															.catch((err) => {
																props.setShowLoading(false);
																crearToast(err.message, true, "danger");
															});

														setShowPopover(false);
													}}
												>
													Pujar
												</IonButton>
											</IonItem>
										</IonContent>
									</IonPopover>
								</IonRow>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonCardContent>
			</IonCard>
		</>
	);
}
