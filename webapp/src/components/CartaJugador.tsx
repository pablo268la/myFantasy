import {
	IonCard,
	IonCardContent,
	IonCol,
	IonImg,
	IonRow,
	IonText
} from "@ionic/react";

import { JugadorTitular } from "../shared/sharedTypes";
import { getIconoEstado, urlBackground } from "./helpers";

type CartaJugadorProps = {
	jugador?: JugadorTitular;
	setJugadorPulsado: (idJugador: string) => void;
	posicion: string;
};

function CartaJugador(props: CartaJugadorProps): JSX.Element {
	return props.jugador !== undefined ? (
		<IonCard
			onClick={() => {
				if (props.jugador) props.setJugadorPulsado(props.jugador.jugador._id);
			}}
			style={{ width: 100 }}
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
									props.jugador.jugador.idEquipo +
									"/image"
								}
							/>

							<div style={{ marginTop: 30 }}>
								{getIconoEstado(props.jugador.jugador)}
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
			style={{ width: 100 }}
		>
			<div
				style={{
					backgroundImage: urlBackground,
				}}
			>
				<IonCardContent>
					<IonRow style={{ width: 100, height: 50, marginLeft: -5 }}>
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
							<div style={{ marginTop: 30 }}></div>
						</div>
					</IonRow>
				</IonCardContent>
			</div>

			<div style={{ background: "primary" }}>
				<IonRow>
					<IonCol>
						<IonText
							style={{ color: "black", fontSize: "11px", fontWeight: "bold" }}
						></IonText>
					</IonCol>
				</IonRow>
			</div>
		</IonCard>
	);
}

export default CartaJugador;
