import {
	IonBadge,
	IonCard,
	IonCardContent,
	IonCol,
	IonIcon,
	IonImg,
	IonPage,
	IonRow,
	IonText
} from "@ionic/react";
import { alertCircle, checkmarkCircle, medkit, warning } from "ionicons/icons";

import { useEffect, useState } from "react";
import { getJugadorById } from "../api/api";
import { Jugador } from "../shared/sharedTypes";

type CartaJugadorProps = {
	id: string;
};

export function CartaJugador(props: CartaJugadorProps): JSX.Element {
	const [jugador, setJugador] = useState<Jugador>();
	//`https:\/\/assets.laligafantasymarca.com\/players\/t186\/p${jugador.fantasyMarcaId}\/256x256\/p${jugador.fantasyMarcaId}_t186_1_001_000.png`

	const getJugador = async () => {
		setJugador(await getJugadorById(props.id));
	};

	useEffect(() => {
		getJugador();
	}, []);

	return jugador ? (
		<IonCard>
			<div
				style={{
					backgroundImage: `url(https://ih1.redbubble.net/image.389384727.9608/flat,128x,075,f-pad,128x128,f8f8f8.u5.jpg)`,
				}}
			>
				<IonCardContent>
					<IonRow>
						<IonCol size="10">
							<div>
								<IonImg src={jugador.foto} />
							</div>
						</IonCol>
						<IonCol size="1">{getIconoEstado(jugador)}</IonCol>
					</IonRow>
				</IonCardContent>
			</div>

			<div style={{ background: "red" }}>
				<IonRow>
					<IonCol size="8" offset="1">
						<IonText style={{ color: "white", fontSize: "10px" }}>
							{jugador.nombre}
						</IonText>
					</IonCol>
					<IonCol size="2">
						<div style={{ alignItems: "flex-start", width: 20, height: 20 }}>
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
			</div>
		</IonCard>
	) : (
		<IonPage></IonPage>
	);

	function getIconoEstado(jugador: Jugador) {
		switch (jugador.estado) {
			case "Disponible":
				return (
					<IonBadge color={"success"}>
						<IonIcon icon={checkmarkCircle} />
					</IonBadge>
				);
			case "Lesionado":
				return (
					<IonBadge color={"danger"}>
						<IonIcon icon={medkit} />
					</IonBadge>
				);
			case "Dudoso":
				return (
					<IonBadge color={"warning"}>
						<IonIcon icon={warning} />
					</IonBadge>
				);
			case "No disponible":
				return (
					<IonBadge color={"danger"}>
						<IonIcon icon={alertCircle} />
					</IonBadge>
				);
		}
	}
}
