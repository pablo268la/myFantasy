import {
	IonCard,
	IonCardContent,
	IonCol,
	IonImg,
	IonRow,
	IonText,
} from "@ionic/react";

import { getIconoEstado, urlBackground } from "../../helpers/helpers";
import { PropiedadJugador } from "../../shared/sharedTypes";

type CartaJugadorProps = {
	jugador?: PropiedadJugador;
	setJugadorPulsado: (idJugador: string) => void;
	posicion: string;
};

function CartaJugador(props: CartaJugadorProps): JSX.Element {
	return props.jugador !== undefined ? (
		<IonCard
			onClick={() => {
				if (props.jugador) props.setJugadorPulsado(props.jugador.jugador._id);
			}}
			style={{
				maxWidth: 100,
				minWidth: 40,
				width: "25%",
				maxHeight: 100,
				minHeight: 40,
				height: "25%",
			}}
		>
			<div
				style={{
					backgroundImage: urlBackground,
				}}
			>
				<IonCardContent>
					<IonRow
						style={{
							width: 100,
							height: 50,
							marginLeft: -20,
						}}
					>
						<IonCol>
							<div style={{ marginTop: -18 }}>
								<IonImg src={props.jugador.jugador.foto} />
							</div>
						</IonCol>
						<div style={{ width: 20, height: 20 }}>
							<IonImg
								src={
									"https://api.sofascore.app/api/v1/team/" +
									props.jugador.jugador.equipo._id +
									"/image"
								}
							/>

							<div style={{ marginTop: 30 }}>
								{getIconoEstado(props.jugador.jugador.estado)}
							</div>
						</div>
					</IonRow>
				</IonCardContent>
			</div>

			<div style={{ background: "primary" }}>
				<IonRow>
					<IonCol>
						<IonText
							style={{ color: "black", fontSize: "11px", fontWeight: "bold" }}
						>
							{props.jugador.jugador.nombre}
						</IonText>
					</IonCol>
				</IonRow>
			</div>
		</IonCard>
	) : (
		<IonCard
			onClick={() => props.setJugadorPulsado(props.posicion)}
			style={{
				maxWidth: 100,
				minWidth: 40,
				width: "25%",
				maxHeight: 100,
				minHeight: 40,
				height: "25%",
			}}
		>
			<div
				style={{
					backgroundImage: urlBackground,
				}}
			>
				<IonCardContent>
					<IonRow style={{ width: 100, height: 50, marginLeft: -20 }}>
						<IonCol>
							<div style={{ marginTop: -18 }}>
								<IonImg
									src={
										"https://assets.laligafantasymarca.com/players/no-player.png"
									}
								/>
							</div>
						</IonCol>
						<div style={{ width: 20, height: 20 }}>
							<div style={{ marginTop: 30 }}>
								{getIconoEstado("No disponible")}
							</div>
						</div>
					</IonRow>
				</IonCardContent>
			</div>

			<div style={{ background: "primary" }}>
				<IonRow>
					<IonCol>
						<IonText
							style={{ color: "white", fontSize: "11px", fontWeight: "bold" }}
						>
							.
						</IonText>
					</IonCol>
				</IonRow>
			</div>
		</IonCard>
	);
}

export default CartaJugador;
