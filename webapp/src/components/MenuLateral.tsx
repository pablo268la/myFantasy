import { IonButton, IonIcon, IonList, useIonRouter } from "@ionic/react";
import { cart, football, home, list, people } from "ionicons/icons";

export function MenuLateral(props: any): JSX.Element {
	const nav = useIonRouter();

	return (
		<>
			<IonList style={{ width: "10%", marginRight: "3%" }}>
				<IonButton color="dark" expand="block" fill="clear">
					<IonIcon slot="start" icon={home}></IonIcon>
					Mis ligas
				</IonButton>
				<IonButton
					onClick={() => nav.push("/clasificacion", "forward")}
					color="dark"
					expand="block"
					fill="clear"
				>
					<IonIcon slot="start" icon={list}></IonIcon>
					Clasificacion
				</IonButton>
				<IonButton
					color="dark"
					expand="block"
					fill="clear"
					onClick={() => nav.push("/carta")}
				>
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
