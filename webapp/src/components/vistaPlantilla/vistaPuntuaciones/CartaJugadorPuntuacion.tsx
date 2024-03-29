import { IonBadge, IonCard, IonCol, IonImg } from "@ionic/react";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { getColorPuntos, urlBackground } from "../../../helpers/helpers";
import {
	PropiedadJugador,
	PuntuacionJugador,
} from "../../../shared/sharedTypes";

type CartaJugadorProps = {
	jugador?: PropiedadJugador;
	puntuacion?: PuntuacionJugador;
	setJugadorPulsado: (idJugador: string) => void;
	posicion: string;
	jornada: number;
	xsSize?: number;
};

function CartaJugador(props: CartaJugadorProps): JSX.Element {
	const [puntuacion, setPuntuacion] = useState<PuntuacionJugador>();

	useEffect(() => {
		setPuntuacion(props.puntuacion);
	}, [props.puntuacion]);

	return (
		<IonCol sizeSm="2" sizeXs={props.xsSize ? props.xsSize.toString() : "2"}>
			<IonCard
				style={{ maxHeight: "200px", maxWidth: "100px" }}
				onClick={() => {
					if (props.jugador) props.setJugadorPulsado(props.jugador.jugador.id);
					else props.setJugadorPulsado(props.posicion);
				}}
			>
				<div
					style={{
						backgroundImage: urlBackground,
					}}
				>
					<IonBadge
						style={{ float: "right", marginRight: "10%", marginTop: "10%" }}
						color={getColorPuntos(puntuacion?.puntos as number)}
					>
						{puntuacion?.puntos ?? "0"}
					</IonBadge>
					<IonImg
						src={
							props.jugador?.jugador.foto
								? props.jugador.jugador.foto
								: "https://assets.laligafantasymarca.com/players/no-player.png"
						}
					/>
					{props.jugador?.jugador.equipo.id ? (
						<IonImg
							style={{
								width: 20,
								maxHeight: 20,
								float: "right",
								marginTop: "-80%",
							}}
							src={
								"https://api.sofascore.app/api/v1/team/" +
								props.jugador.jugador.equipo.id +
								"/image"
							}
						/>
					) : (
						<Icon
							style={{
								width: 20,
								maxHeight: 40,
								float: "right",
								marginTop: "-90%",
							}}
							color="white"
							width="20"
							height="30"
							icon="mdi:badge-outline"
						/>
					)}
				</div>
				<p
					style={{
						whiteSpace: "nowrap",
						fontSize: "50%",
						fontWeight: "bold",
						overflow: "hidden",
						textOverflow: "ellipsis",
						lineHeight: "16px",
						maxHeight: "32px",
					}}
				>
					{props.jugador?.jugador.nombre
						? props.jugador.jugador.nombre
						: "No disponible"}
				</p>
			</IonCard>
		</IonCol>
	);
}

export default CartaJugador;
