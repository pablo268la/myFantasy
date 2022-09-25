import {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import { notificationsCircleOutline } from "ionicons/icons";
import React from "react";

export const ModalJugador: React.FC = () => {
	return (
		<>
			<IonHeader>
				<IonToolbar id="modal-toolbar" className="ion-no-padding ion-no-margin">
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
		</>
	);
};
