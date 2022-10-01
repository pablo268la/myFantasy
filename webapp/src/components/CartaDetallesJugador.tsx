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

import { Jugador, PlantillaUsuario } from "../shared/sharedTypes";
import { getIconoEstado, ponerPuntosAValor, urlBackground } from "./helpers";
import { ListaJugadoresCambio } from "./ListaJugadoresCambio";

type CartaJugadorProps = {
	jugador?: Jugador;
	esParaCambio: boolean;
	plantilla: PlantillaUsuario;
	jugadores: Jugador[];
	posicion?: string;
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
											<IonImg src={jugador.foto} />
										</div>
									</IonCol>
									<IonCol>
										<div style={{ width: 30, height: 30, marginTop: -20 }}>
											<IonImg
												src={
													"https://api.sofascore.app/api/v1/team/" +
													jugador?.idEquipo +
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
								{jugador.posicion.substring(0, 3).toUpperCase()}
							</IonBadge>
							<IonLabel style={{ marginLeft: 10, color: "light" }}>
								{jugador.nombre}
							</IonLabel>
							<IonLabel slot="end">PTS:</IonLabel>
							<IonText slot="end">{jugador.puntos}</IonText>
						</IonItem>

						<IonItem lines="none" color={"primary"}>
							{getIconoEstado(jugador)}
							<IonLabel style={{ marginLeft: 10, color: "light" }}>
								{ponerPuntosAValor(jugador.valor)}
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
						"Quitar de la alineación",
						props.esParaCambio,
						props.plantilla,
						jugador.posicion,
						props.jugadores
					)}
				</>
			}
		</>
	) : (
		<>
			{renderCambios(
				"Dejar posicion vacia",
				props.esParaCambio,
				props.plantilla,
				props.posicion || "",
				props.jugadores
			)}
		</>
	);
}

function renderCambios(
	texto: string,
	esParaCambio: boolean,
	plantilla: PlantillaUsuario,
	posicion: string,
	jugadores: Jugador[]
) {
	if (esParaCambio)
		return (
			<>
				<IonButton shape="round" expand="block">
					{texto}
				</IonButton>
				<ListaJugadoresCambio
					plantilla={plantilla}
					posicion={posicion}
					jugadores={jugadores}
				/>
			</>
		);
}
