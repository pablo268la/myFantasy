import {
	IonBadge,
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
import {
	getColorBadge,
	getColorEstado,
	getIconoEstado,
	ponerPuntosAValor,
	urlBackground,
} from "../../../helpers/helpers";
import { PropiedadJugador } from "../../../shared/sharedTypes";
import { PuntuacionesJugador } from "../PuntuacionesJugador";

type CartaPuntuacionJugadorProps = {
	propiedadJugador?: PropiedadJugador;
	showPuntuaciones: boolean;
	setJugadorPulsado: (idJugador: string) => void;
	jornada: number;
};

export function CartaPuntuacionJugador(
	props: CartaPuntuacionJugadorProps
): JSX.Element {
	const propiedadJugador = props.propiedadJugador;

	return propiedadJugador ? (
		<>
			<IonCard style={{ width: "100%" }} color="primary">
				<IonCardContent
					onClick={(e) => {
						props.setJugadorPulsado(propiedadJugador.jugador._id);
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
								</IonItem>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonCardContent>
			</IonCard>
			{props.showPuntuaciones ? (
				<IonGrid>
					<PuntuacionesJugador
						jugador={propiedadJugador}
						jornada={props.jornada}
					/>
				</IonGrid>
			) : (
				<></>
			)}
		</>
	) : (
		<></>
	);
}
