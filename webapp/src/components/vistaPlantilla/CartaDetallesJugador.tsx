import {
	IonActionSheet,
	IonBadge,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonImg,
	IonItem,
	IonLabel,
	IonRow,
	IonText,
} from "@ionic/react";

import { cart, cash, close } from "ionicons/icons";
import { useState } from "react";
import {
	getColorBadge,
	getIconoEstado,
	ponerPuntosAValor,
	urlBackground,
} from "../../helpers/helpers";
import { PropiedadJugador } from "../../shared/sharedTypes";
import { ListaJugadoresCambio } from "./ListaJugadoresCambio";
import { Formacion } from "./VistaPlantilla";

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
};

export function CartaDetallesJugador(props: CartaJugadorProps): JSX.Element {
	const [propiedadJugador, setPropiedadJugador] = useState<
		PropiedadJugador | undefined
	>(props.propiedadJugador);

	const [showActionSheet, setShowActionSheet] = useState(false);

	return propiedadJugador ? (
		<>
			<IonCard style={{ width: 500 }}>
				<IonRow>
					<div
						style={{
							backgroundImage: urlBackground,
							width: 130,
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
											<IonImg src={propiedadJugador.jugador.foto} />
										</div>
									</IonCol>
									<IonCol>
										<div style={{ width: 30, height: 30, marginTop: -20 }}>
											<IonImg
												src={
													"https://api.sofascore.app/api/v1/team/" +
													propiedadJugador.jugador.equipo._id +
													"/image"
												}
											/>
										</div>
									</IonCol>
								</IonRow>
							</IonCardContent>
						</IonCol>
					</div>
					<IonCol style={{ backgroundColor: "primary" }}>
						<IonItem color={"primary"}>
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
							<IonLabel style={{ marginLeft: 10, color: "light" }}>
								{propiedadJugador.jugador.nombre}
							</IonLabel>
							<IonLabel slot="end">PTS:</IonLabel>
							<IonText slot="end">{propiedadJugador.jugador.puntos}</IonText>
						</IonItem>

						<IonItem lines="none" color={"primary"}>
							{getIconoEstado(propiedadJugador.jugador.estado)}
							<IonLabel style={{ marginLeft: 10, color: "light" }}>
								{ponerPuntosAValor(propiedadJugador.jugador.valor)}
							</IonLabel>
							<IonButton
								onClick={() => setShowActionSheet(true)}
								color="secondary"
								slot="end"
							>
								ACCIONES
							</IonButton>
							<IonActionSheet
								header={
									"¿Que deseas hacer con " +
									propiedadJugador.jugador.nombre +
									"?"
								}
								isOpen={showActionSheet}
								onDidDismiss={() => setShowActionSheet(false)}
								buttons={[
									{
										text: "Añadir al mercado",
										icon: cart,
										handler: () => {},
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
								]}
							></IonActionSheet>
						</IonItem>
					</IonCol>
				</IonRow>
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
						}
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
				() => {}
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
	onclick: () => void
) {
	if (esParaCambio)
		return (
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
				/>
			</>
		);
}
