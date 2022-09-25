import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonHeader,
	IonIcon,
	IonImg,
	IonItem,
	IonLabel,
	IonModal,
	IonRow,
	IonText,
	IonTitle,
	IonToolbar
} from "@ionic/react";
import { closeSharp, notificationsCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

import { Jugador } from "../shared/sharedTypes";
import { urlBackground } from "./helpers";

type CartaJugadorProps = {
	jugador: Promise<Jugador>;
};

export function CartaJugador(props: CartaJugadorProps): JSX.Element {
	const [jugador, setJugador] = useState<Jugador>();

	const [showModal, setShowModal] = useState(false);

	function handleCloseCard(event: any) {
		event.stopPropagation();
	}

	function showNotificationInformation() {
		setShowModal(true);
	}

	useEffect(() => {
		props.jugador.then((j) => {
			setJugador(j);
		});
	}, []);

	return jugador ? (
		<>
			<IonCard
				button={true}
				onClick={() => showNotificationInformation()}
				style={{ width: 100 }}
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
									<IonImg src={jugador.foto} />
								</div>
							</IonCol>
							<div style={{ width: 20, height: 20 }}>
								<IonImg
									src={
										"https://api.sofascore.app/api/v1/team/" +
										jugador.idEquipo +
										"/image"
									}
								/>
							</div>
						</IonRow>
					</IonCardContent>
				</div>

				<div style={{ background: "primary" }}>
					<IonRow>
						<IonCol>
							<IonText
								style={{
									color: "black",
									fontSize: "11px",
									fontWeight: "bold",
								}}
							>
								{jugador.nombre}
							</IonText>
						</IonCol>
					</IonRow>
				</div>
			</IonCard>

			<IonModal
				isOpen={showModal}
				canDismiss={true}
				onDidDismiss={() => {
					setShowModal(false);
					console.log("cerro");
				}}
			>
				<IonHeader>
					<IonToolbar
						id="modal-toolbar"
						className="ion-no-padding ion-no-margin"
					>
						<IonTitle id="modal-title-text">
							My modal with a button that will hide the card
						</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent scrollY={false}>
					<IonItem
						className="ion-no-margin ion-no-padding"
						lines="none"
						id="notification-content-icon-item"
					>
						<IonIcon
							icon={notificationsCircleOutline}
							id="notification-content-icon"
						/>
					</IonItem>
					<IonItem
						lines="none"
						id="notification-content-subtitle-item"
						className="ion-no-margin ion-no-padding"
					>
						<IonLabel
							id="notification-content-subtitle-label"
							className="ion-text-wrap ion-no-margin ion-no-padding"
						>
							Don't miss anything
						</IonLabel>
					</IonItem>
				</IonContent>
				<IonButton onDoubleClick={() => console.log(1)}>
					<IonIcon icon={closeSharp}></IonIcon>
				</IonButton>
			</IonModal>
		</>
	) : (
		<IonCard></IonCard>
	);
}
