import { IonButton, IonIcon, IonList } from "@ionic/react";
import { cart, football, home, list, people } from "ionicons/icons";
import { useHistory } from "react-router-dom";

export function MenuLateral(props: any): JSX.Element {
	const history = useHistory();

	return (
		<>
			<IonList style={{ width: "10%", marginRight: "3%" }}>
				<IonButton color="dark" expand="block" fill="clear">
					<IonIcon slot="start" icon={home}></IonIcon>
					Mis ligas
				</IonButton>
				<IonButton
					href="/clasificacion"
					color="dark"
					expand="block"
					fill="clear"
				>
					<IonIcon slot="start" icon={list}></IonIcon>
					Clasificacion
				</IonButton>
				<IonButton color="dark" expand="block" fill="clear" href="/plantilla">
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
