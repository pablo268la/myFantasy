import {
	IonButton,
	IonButtons,
	IonIcon,
	IonMenuButton,
	IonTitle,
	IonToolbar,
	useIonAlert,
} from "@ionic/react";
import { logOut } from "ionicons/icons";

export function FantasyToolbar(props: any): JSX.Element {
	const [presentAlert] = useIonAlert();

	return (
		<>
			<IonToolbar>
				<IonButtons slot="start">
					<IonMenuButton></IonMenuButton>
				</IonButtons>
				<IonTitle>Headline coach</IonTitle>

				<IonButton
					slot="end"
					fill="clear"
					onClick={() => {
						localStorage.removeItem("token");
						localStorage.removeItem("email");
						window.location.href = "/";
					}}
				>
					<IonIcon icon={logOut} />
				</IonButton>
			</IonToolbar>
		</>
	);
}
