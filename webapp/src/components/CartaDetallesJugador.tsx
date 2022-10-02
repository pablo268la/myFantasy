import {
	IonBadge,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonImg,
	IonItem,
	IonLabel,
	IonRow,
	IonText
} from "@ionic/react";

import { JugadorTitular } from "../shared/sharedTypes";
import { getIconoEstado, ponerPuntosAValor, urlBackground } from "./helpers";
import { ListaJugadoresCambio } from "./ListaJugadoresCambio";
import { Formacion } from "./VistaPlantilla";

type CartaJugadorProps = {
	jugador?: JugadorTitular;
	esParaCambio: boolean;
	posicion?: string;
	porteros: JugadorTitular[];
	defensas: JugadorTitular[];
	mediocentros: JugadorTitular[];
	delanteros: JugadorTitular[];
	formacion: Formacion;
	cambiarTitulares: (
		lista: JugadorTitular[],
		idIn: string,
		idOut: string
	) => void;
};

export function CartaDetallesJugador(props: CartaJugadorProps): JSX.Element {
	const jugador = props.jugador;

	return jugador ? (
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
											<IonImg src={jugador.jugador.foto} />
										</div>
									</IonCol>
									<IonCol>
										<div style={{ width: 30, height: 30, marginTop: -20 }}>
											<IonImg
												src={
													"https://api.sofascore.app/api/v1/team/" +
													jugador.jugador.idEquipo +
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
							<IonBadge color={"secondary"}>
								{jugador.jugador.posicion.substring(0, 3).toUpperCase()}
							</IonBadge>
							<IonLabel style={{ marginLeft: 10, color: "light" }}>
								{jugador.jugador.nombre}
							</IonLabel>
							<IonLabel slot="end">PTS:</IonLabel>
							<IonText slot="end">{jugador.jugador.puntos}</IonText>
						</IonItem>

						<IonItem lines="none" color={"primary"}>
							{getIconoEstado(jugador.jugador)}
							<IonLabel style={{ marginLeft: 10, color: "light" }}>
								{ponerPuntosAValor(jugador.jugador.valor)}
							</IonLabel>
							<IonButton color="secondary" slot="end">
								ACCIONES
							</IonButton>
						</IonItem>
					</IonCol>
				</IonRow>
			</IonCard>

			{
				<>
					{renderCambios(
						jugador.jugador._id,
						"Quitar de la alineación",
						props.esParaCambio,
						jugador.jugador.posicion,
						props.porteros,
						props.defensas,
						props.mediocentros,
						props.delanteros,
						props.formacion,
						props.cambiarTitulares,
						() => {
							props.cambiarTitulares(
								getListaPosicion(jugador.jugador.posicion),
								"",
								jugador.jugador._id
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

	function getListaPosicion(pos: string): JugadorTitular[] {
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
	porteros: JugadorTitular[],
	defensas: JugadorTitular[],
	mediocentros: JugadorTitular[],
	delanteros: JugadorTitular[],
	formacion: Formacion,
	cambiarTitulares: (
		lista: JugadorTitular[],
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
