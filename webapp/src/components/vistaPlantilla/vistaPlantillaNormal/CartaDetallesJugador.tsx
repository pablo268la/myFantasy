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
	IonRow,
} from "@ionic/react";

import { Icon } from "@iconify/react";
import { cart, cash, close } from "ionicons/icons";
import { useState } from "react";
import { añadirJugadorAMercado } from "../../../endpoints/mercadoEndpoints";
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
};

export function CartaDetallesJugador(props: CartaJugadorProps): JSX.Element {
	const [propiedadJugador, setPropiedadJugador] = useState<
		PropiedadJugador | undefined
	>(props.propiedadJugador);

	const [showActionSheet, setShowActionSheet] = useState(false);

	return propiedadJugador ? (
		<>
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
								{propiedadJugador.jugador.equipo._id !== "-1" ? (
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
											propiedadJugador.jugador.equipo._id +
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
										//setShowPuntuaciones(false);
									}}
									buttons={
										props.isSameUser
											? [
													{
														text: "Añadir al mercado",
														icon: cart,
														handler: async () => {
															await añadirJugadorAMercado(
																propiedadJugador,
																getLocalLigaSeleccionada()
															);
														},
													},
													{
														text: "Vender inmediatamente",
														icon: cash,
														handler: () => {},
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
						propiedadJugador.jugador._id,
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
								propiedadJugador.jugador._id
							);
						},
						props.isSameUser
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
				props.posicion || "",
				props.porteros,
				props.defensas,
				props.mediocentros,
				props.delanteros,
				props.formacion,
				props.cambiarTitulares,
				() => {},
				props.isSameUser
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
	isSameUser: boolean
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
						/>
					</>
				) : (
					<></>
				)}
			</>
		);
}
