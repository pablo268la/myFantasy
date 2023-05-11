import {
	IonAccordion,
	IonAccordionGroup,
	IonBadge,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonGrid,
	IonImg,
	IonItem,
	IonLabel,
	IonRow,
	IonText,
	useIonToast,
} from "@ionic/react";
import { useState } from "react";
import {
	aceptarOferta,
	rechazarOferta,
} from "../../endpoints/mercadoEndpoints";
import {
	getColorBadge,
	ponerPuntosAValor,
	urlBackground,
} from "../../helpers/helpers";
import { PropiedadJugador } from "../../shared/sharedTypes";

type CartaVentaProps = {
	propiedadJugadorEnVenta: PropiedadJugador;
	idLiga: string;
	actualizarMercado: () => void;
};

export function CartaVenta(props: CartaVentaProps): JSX.Element {
	const [tiempoRestante, setTiempoRestante] = useState<string>("");

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}
	const [propiedadJugadorEnVenta, setPropiedadJugadorEnVenta] =
		useState<PropiedadJugador>(props.propiedadJugadorEnVenta);
	var x = setInterval(function () {
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
															propiedadJugadorEnVenta.jugador.equipo._id +
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

								<IonRow style={{ justifyContent: "space-between" }}>
									<IonLabel>Tiempo restante: {tiempoRestante}</IonLabel>
									{propiedadJugadorEnVenta.venta.ofertas.length > 0 ? (
										<IonLabel>
											Pujas: {propiedadJugadorEnVenta.venta.ofertas.length}
										</IonLabel>
									) : (
										<></>
									)}
								</IonRow>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonCardContent>
				<IonAccordionGroup>
					<IonAccordion value="first" toggleIconSlot="start">
						<IonItem slot="header" color="light">
							<IonLabel>Ver ofertas</IonLabel>
						</IonItem>
						<div className="ion-padding" slot="content">
							{propiedadJugadorEnVenta.venta.ofertas
								.filter((o) => o.estado === "ACTIVA")
								.map((oferta) => {
									return (
										<IonItem>
											<IonLabel>{oferta.comprador.nombre}</IonLabel>
											<IonLabel>
												{ponerPuntosAValor(oferta.valorOferta)}
											</IonLabel>
											<IonButton
												color={"success"}
												onClick={() => {
													aceptarOferta(
														props.idLiga,
														oferta.comprador.id,
														propiedadJugadorEnVenta.jugador._id
													)
														.then((res) => {
															setPropiedadJugadorEnVenta(res);
															props.actualizarMercado();
															crearToast("Oferta aceptada", true, "success");
														})
														.catch((err) => {
															crearToast(err, true, "danger");
														});
												}}
											>
												Aceptar
											</IonButton>
											<IonButton
												color={"danger"}
												onClick={() => {
													rechazarOferta(
														props.idLiga,
														oferta.comprador.id,
														propiedadJugadorEnVenta.jugador._id
													)
														.then((res) => {
															setPropiedadJugadorEnVenta(res);
															props.actualizarMercado();
															crearToast("Oferta rechazada", true, "success");
														})
														.catch((err) => {
															crearToast(err, true, "danger");
														});
												}}
											>
												Rechazar
											</IonButton>
										</IonItem>
									);
								})}
						</div>
					</IonAccordion>
				</IonAccordionGroup>
			</IonCard>
		</>
	);
}
