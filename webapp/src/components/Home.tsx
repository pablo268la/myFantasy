import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonList,
	IonMenu,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonRouter
} from "@ionic/react";
import { cart, football, home, list, people } from "ionicons/icons";
import VistaPlantilla from "./VistaPlantilla";

export function Home(props: any): JSX.Element {
	const nav = useIonRouter();

	return (
		<>
			<IonMenu type="reveal" contentId="main-content">
				<IonHeader>
					<IonToolbar>
						<IonTitle></IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
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
							onClick={() => nav.push("/plantilla", "forward")}
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
				</IonContent>
			</IonMenu>
			<IonPage id="main-content">
				<IonHeader>
					<IonToolbar>
						<IonButtons slot="start">
							<IonMenuButton></IonMenuButton>
						</IonButtons>
						<IonTitle>Menu</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<VistaPlantilla usuario={undefined}></VistaPlantilla>
				</IonContent>
			</IonPage>
		</>
	);
}
