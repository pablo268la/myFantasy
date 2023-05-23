import {
    IonActionSheet,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCol,
    IonGrid,
    IonImg,
    IonItem,
    IonLabel,
    IonLoading,
    IonRow,
    useIonActionSheet,
} from "@ionic/react";

import { Icon } from "@iconify/react";
import { cart, cash, close } from "ionicons/icons";
import { useState } from "react";
import {
    añadirJugadorAMercado,
    eliminarJugadorDelMercado,
} from "../../../endpoints/mercadoEndpoints";
import {
    getColorBadge,
    getColorEstado,
    getIconoEstado,
    getLocalLigaSeleccionada,
    ponerPuntosAValor,
    urlBackground,
} from "../../../helpers/helpers";
import { PropiedadJugador } from "../../../shared/sharedTypes";
import { Formacion } from "../VistaPlantilla";
import { ListaJugadoresCambio } from "./ListaJugadoresCambio";
type CartaJugadorProps = {
	propiedadJugador?: PropiedadJugador;
	esParaCambio: boolean;
	posicion?: string;
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	formacion: Formacion;
	cambiarTitulares: (
		lista: PropiedadJugador[],
		idIn: string,
		idOut: string
	) => void;
	isSameUser: boolean;
	setJugadorSeleccionadoMethod: (pj: PropiedadJugador) => void;
	crearToast: (message: string, show: boolean, color: string) => void;
};

export function CartaDetallesJugador(props: CartaJugadorProps): JSX.Element {
	const propiedadJugador = props.propiedadJugador;
	const [actionSheet] = useIonActionSheet();
	const [showActionSheet, setShowActionSheet] = useState(false);

	const [showLoading, setShowLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>();

	const [enVenta, setEnVenta] = useState<boolean>(
		propiedadJugador?.venta.enVenta ?? false
	);

	function seguroVenderJugador() {
		return new Promise<boolean>((resolve, reject) => {
			actionSheet({
				header: "¿Estas seguro de querer vender a este jugador?",
				buttons: [
					{
						text: "Si",
						role: "confirm",
					},
					{
						text: "No",
						role: "cancel",
					},
				],
				onWillDismiss: (ev) => {
					if (ev.detail.role === "confirm") {
						props.crearToast("Jugador eliminado", true, "success");
					} else {
						reject();
					}
				},
			});
		});
	}

	return propiedadJugador ? (
		<>
			<IonLoading isOpen={showLoading} message={message} />
			<IonCard style={{ width: "100%" }} color="primary">
				<IonCardContent
					onClick={(e) => {
						let a = e.target as HTMLIonButtonElement;
						if (a.type === "button") {
							setShowActionSheet(true);
						} else {
							props.setJugadorSeleccionadoMethod(propiedadJugador);
						}
					}}
				>
					<IonGrid>
						<IonRow>
							<IonCol
								size="3"
								style={{
									backgroundSize: "cover",
									backgroundImage: urlBackground,
								}}
							>
								<IonImg
									style={{
										maxHeight: 100,
										maxWidth: 100,
									}}
									src={propiedadJugador.jugador.foto}
								/>
								{propiedadJugador.jugador.equipo.id !== "-1" ? (
									<IonImg
										style={{
											maxWidth: 30,
											maxHeight: 30,
											width: 20,
											height: 30,
											marginTop: -80,
										}}
										src={
											"https://api.sofascore.app/api/v1/team/" +
											propiedadJugador.jugador.equipo.id +
											"/image"
										}
									></IonImg>
								) : (
									<Icon
										style={{
											width: 20,
											maxHeight: 30,
											float: "left",
											marginTop: "-60%",
										}}
										color="white"
										width="20"
										height="30"
										icon="mdi:badge-outline"
									/>
								)}
							</IonCol>

							<IonCol size="9">
								<IonItem color="tertiary">
									<IonBadge
										style={{
											backgroundColor: getColorBadge(
												propiedadJugador.jugador.posicion
											),
										}}
									>
										{propiedadJugador.jugador.posicion
											.substring(0, 3)
											.toUpperCase()}
									</IonBadge>
									<IonLabel
										style={{
											marginLeft: 10,
											fontSize: "1vmax",
										}}
									>
										{propiedadJugador.jugador.nombre}
									</IonLabel>
									<IonLabel
										style={{
											fontSize: "1vmax",
										}}
										slot="end"
									>
										{"PTS: "}
										{propiedadJugador.jugador.puntos}
									</IonLabel>
								</IonItem>
								<IonItem lines="none" color="tertiary">
									<IonBadge
										color={getColorEstado(
											propiedadJugador.jugador.estado as string
										)}
									>
										{getIconoEstado(propiedadJugador.jugador.estado)}
									</IonBadge>

									<IonLabel
										style={{
											fontSize: "1vmax",
											marginLeft: 10,
										}}
									>
										{ponerPuntosAValor(propiedadJugador.jugador.valor)}
									</IonLabel>

									<IonButton
										onClick={() => {
											setShowActionSheet(true);
										}}
										color="primary"
										slot="end"
										id="botonAcciones"
										style={{
											fontSize: "1vmax",
										}}
									>
										ACCIONES
									</IonButton>
								</IonItem>
								<IonActionSheet
									header={
										"¿Que quieres hacer con " +
										propiedadJugador.jugador.nombre +
										"?"
									}
									isOpen={showActionSheet}
									onDidDismiss={() => {
										setShowActionSheet(false);
									}}
									buttons={
										props.isSameUser
											? [
													{
														text: !enVenta
															? "Añadir al mercado"
															: "Quitar del mercado",
														icon: cart,
														handler: async () => {
															if (enVenta) {
																setShowLoading(true);
																setMessage("Quitando jugador del mercado...");
																await eliminarJugadorDelMercado(
																	getLocalLigaSeleccionada(),
																	propiedadJugador.jugador.id
																)
																	.then((res) => {
																		setShowLoading(false);
																		setEnVenta(false);
																		props.crearToast(
																			"Jugador eliminado del mercado",
																			true,
																			"success"
																		);
																	})
																	.catch((err) => {
																		setShowLoading(false);
																		props.crearToast(err.message, true, "danger");
																	});
															} else {
																setShowLoading(true);
																setMessage("Añadiendo jugador al mercado...");
																await añadirJugadorAMercado(
																	propiedadJugador,
																	getLocalLigaSeleccionada()
																)
																	.then((res) => {
																		setShowLoading(false);
																		setEnVenta(true);
																		props.crearToast(
																			"Jugador añadido al mercado",
																			true,
																			"success"
																		);
																	})
																	.catch((err) => {
																		setShowLoading(false);
																		props.crearToast(err.message, true, "danger");
																	});
															}
														},
													},
													{
														text: "Vender inmediatamente",
														icon: cash,
														handler: async () => {
															await seguroVenderJugador();
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
														text: "Hacer oferta",
														icon: cart,
														handler: () => {},
													},
													{
														text: "Cancelar",
														icon: close,
														handler: () => {},
													},
											  ]
									}
								></IonActionSheet>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonCardContent>
			</IonCard>

			{
				<>
					{renderCambios(
						propiedadJugador.jugador.id,
						"Quitar de la alineación",
						props.esParaCambio,
						propiedadJugador.jugador.posicion,
						props.porteros,
						props.defensas,
						props.mediocentros,
						props.delanteros,
						props.formacion,
						props.cambiarTitulares,
						() => {
							props.cambiarTitulares(
								getListaPosicion(propiedadJugador.jugador.posicion),
								"",
								propiedadJugador.jugador.id
							);
						},
						props.isSameUser,
						props.crearToast
					)}
				</>
			}
		</>
	) : (
		<>
			{renderCambios(
				"",
				"Dejar posicion vacia",
				props.esParaCambio,
				props.posicion ?? "",
				props.porteros,
				props.defensas,
				props.mediocentros,
				props.delanteros,
				props.formacion,
				props.cambiarTitulares,
				() => {},
				props.isSameUser,
				props.crearToast
			)}
		</>
	);

	function getListaPosicion(pos: string): PropiedadJugador[] {
		switch (pos) {
			case "Portero":
				return props.porteros;
			case "Defensa":
				return props.defensas;
			case "Mediocentro":
				return props.mediocentros;
			case "Delantero":
				return props.delanteros;
			default:
				return [];
		}
	}
}

function renderCambios(
	idJugador: string,
	texto: string,
	esParaCambio: boolean,
	posicion: string,
	porteros: PropiedadJugador[],
	defensas: PropiedadJugador[],
	mediocentros: PropiedadJugador[],
	delanteros: PropiedadJugador[],
	formacion: Formacion,
	cambiarTitulares: (
		lista: PropiedadJugador[],
		idIn: string,
		idOut: string
	) => void,
	onclick: () => void,
	isSameUser: boolean,
	crearToast: (message: string, show: boolean, color: string) => void
) {
	if (esParaCambio)
		return (
			<>
				{isSameUser ? (
					<>
						<IonButton onClick={onclick} shape="round" expand="block">
							{texto}
						</IonButton>

						<ListaJugadoresCambio
							idJugador={idJugador}
							posicion={posicion}
							porteros={porteros}
							defensas={defensas}
							mediocentros={mediocentros}
							delanteros={delanteros}
							formacion={formacion}
							cambiarTitulares={cambiarTitulares}
							isSameUser={isSameUser}
							crearToast={crearToast}
						/>
					</>
				) : (
					<></>
				)}
			</>
		);
}
