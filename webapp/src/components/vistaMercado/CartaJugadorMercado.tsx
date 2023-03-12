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
} from "@ionic/react";
import { cart, close, pencil } from "ionicons/icons";
import { useState } from "react";
import { hacerPuja } from "../../endpoints/mercadoEndpoints";
import {
	getColorBadge,
	getUsuarioLogueado,
	ponerPuntosAValor,
	urlBackground,
} from "../../helpers/helpers";
import { Oferta, Venta } from "../../shared/sharedTypes";

type CartaJugadorMercadoProps = {
	jugadorEnVenta: Venta;
	idLiga: string;
	resetMercado: () => void;
	reseteandoMercado: boolean;
};

export function CartaJugadorMercado(
	props: CartaJugadorMercadoProps
): JSX.Element {
	const [tiempoRestante, setTiempoRestante] = useState<string>("");

	const [jugadorEnVenta, setJugadorEnVenta] = useState<Venta>(
		props.jugadorEnVenta
	);

	const [puja, setPuja] = useState<number>(
		props.jugadorEnVenta.propiedadJugador.jugador.valor
	);

	const [showActionSheet, setShowActionSheet] = useState(false);
	const [showPopover, setShowPopover] = useState(false);

	var x = setInterval(function () {
		var countDownDate = new Date(jugadorEnVenta.fechaLimite).getTime();
		// Get today's date and time
		var now = new Date().getTime();

		// Find the distance between now and the count down date
		var distance = countDownDate - now;

		if (distance < 0) {
			clearInterval(x);
			setTiempoRestante("EXPIRED");
			if (!props.reseteandoMercado) props.resetMercado();
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

		await hacerPuja(jugadorEnVenta, props.idLiga, o).then((res) => {
			setJugadorEnVenta(res);
		});
	};

	const hasPuja = () => {
		let p = jugadorEnVenta.ofertas.filter((oferta) => {
			return getUsuarioLogueado()?.id === oferta.comprador.id;
		});
		return p.length > 0;
	};

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
													<IonImg src={jugadorEnVenta.propiedadJugador.jugador.foto} />
												</div>
											</IonCol>
											<IonCol>
												<div style={{ width: 30, height: 30, marginTop: -20 }}>
													<IonImg
														src={
															"https://api.sofascore.app/api/v1/team/" +
															jugadorEnVenta.propiedadJugador.jugador.equipo._id +
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
												jugadorEnVenta.propiedadJugador.jugador.posicion
											),
										}}
									>
										{jugadorEnVenta.propiedadJugador.jugador.posicion
											.substring(0, 3)
											.toUpperCase()}
									</IonBadge>
									<IonLabel style={{ marginLeft: 10, color: "light" }}>
										{jugadorEnVenta.propiedadJugador.jugador.nombre}
									</IonLabel>
									<IonLabel slot="end">PTS:</IonLabel>
									<IonText slot="end">
										{jugadorEnVenta.propiedadJugador.jugador.puntos}
									</IonText>
								</IonItem>
								<IonRow>
									<IonLabel>
										{ponerPuntosAValor(jugadorEnVenta.propiedadJugador.jugador.valor)}
									</IonLabel>
								</IonRow>
								<IonRow>
									<IonLabel>
										Vendedor: {jugadorEnVenta.propiedadJugador.usuario.usuario}
									</IonLabel>
								</IonRow>
								<IonRow style={{ justifyContent: "space-between" }}>
									<IonLabel>Tiempo restante: {tiempoRestante}</IonLabel>
									{jugadorEnVenta.ofertas.length > 0 ? (
										<IonLabel>Pujas: {jugadorEnVenta.ofertas.length}</IonLabel>
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
											jugadorEnVenta.propiedadJugador.jugador.nombre +
											"?"
										}
										isOpen={showActionSheet}
										onDidDismiss={() => setShowActionSheet(false)}
										buttons={
											hasPuja()
												? [
														{
															text: "Editar pujas",
															icon: pencil,
															handler: () => {
																setShowPopover(true);
															},
														},
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
													onIonChange={(e) => {
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
													onClick={() => {
														hacerPujaAlBack();
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
