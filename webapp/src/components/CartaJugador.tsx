import {
	IonBadge,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonCol,
	IonIcon,
	IonImg,
	IonItem,
	IonPage,
	IonRow
} from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";

import { useEffect, useState } from "react";
import { getJugadorById } from "../api/api";
import { Jugador } from "../shared/sharedTypes";

type CartaJugadorProps = {
	id: string;
};

export function CartaJugador(props: CartaJugadorProps): JSX.Element {
	const [jugador, setJugador] = useState<Jugador>();

	const getJugador = async () => {
		setJugador(await getJugadorById(props.id));
	};

	useEffect(() => {
		getJugador();
	}, []);

	return jugador ? (
		<IonCard>
			<IonCardHeader>
				<IonRow>
					<IonCol size="10">
						<IonCardTitle>{jugador.nombre}</IonCardTitle>
					</IonCol>
					<IonCol size="2">
						<div style={{ alignItems: "center", width: 20, height: 20 }}>
							<IonImg src={jugador.foto} />
						</div>
					</IonCol>
				</IonRow>
			</IonCardHeader>
			<IonCardContent>
				<IonRow>
					<IonCol>
						<div style={{ alignItems: "center", width: 100, height: 100 }}>
							<IonImg src={jugador.foto} />
						</div>
					</IonCol>
					<IonCol>
						<div style={{ width: 100, height: 100 }}>
							<IonItem>
								<IonBadge slot="end" color={"light"} style={{ marginTop: 15 }}>
									<IonIcon icon={checkmarkCircle} />
								</IonBadge>
							</IonItem>
						</div>
					</IonCol>
				</IonRow>
			</IonCardContent>
		</IonCard>
	) : (
		<IonPage></IonPage>
	);
}
