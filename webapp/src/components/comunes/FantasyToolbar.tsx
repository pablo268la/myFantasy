import {
	IonButton,
	IonButtons,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { logOut } from "ionicons/icons";
import { getUsuarioLogueado } from "../../helpers/helpers";

export function FantasyToolbar(props: any): JSX.Element {
	return (
		<>
			<IonToolbar>
				<IonButtons slot="start">
					<IonMenuButton></IonMenuButton>
				</IonButtons>
				<IonTitle>Headline coach</IonTitle>

				<IonItem slot="end">
					<IonLabel position="stacked">Usuario</IonLabel>
					<IonInput
						readonly
						placeholder={getUsuarioLogueado()?.usuario}
					></IonInput>
				</IonItem>

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
