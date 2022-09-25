import { IonButton, IonContent, IonPage } from "@ionic/react";
import { ModalJugador } from "./Modal";

export function Clasificacion(props: any): JSX.Element {
	return (
		<>
			<IonPage>
				<IonContent>
					<IonButton>Button</IonButton>
					<ModalJugador></ModalJugador>
				</IonContent>
			</IonPage>
		</>
	);
}
