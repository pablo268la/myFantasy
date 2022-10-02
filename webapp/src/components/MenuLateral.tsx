import { IonButton, IonIcon, IonList, useIonRouter } from "@ionic/react";
import { cart, football, list, people } from "ionicons/icons";

export function MenuLateral(): JSX.Element {
	const router = useIonRouter();
	return (
		<>
			<IonList style={{ width: "10%", marginRight: "3%" }}>
				<IonButton
					href="/clasificacion"
					color="dark"
					expand="block"
					fill="clear"
				>
					<IonIcon slot="start" icon={list}></IonIcon>
					Clasificacion
				</IonButton>
				<IonButton color="dark" expand="block" fill="clear">
					<IonIcon slot="start" icon={people}></IonIcon>
					Plantilla
				</IonButton>
				<IonButton color="dark" expand="block" fill="clear">
					<IonIcon slot="start" icon={cart}></IonIcon>
					Mercado
				</IonButton>
				<IonButton color="dark" expand="block" fill="clear">
					<IonIcon slot="start" icon={football}></IonIcon>
					Resultados
				</IonButton>
			</IonList>
		</>
	);
}
