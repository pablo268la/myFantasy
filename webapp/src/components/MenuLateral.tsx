import {
	IonButton,
	IonContent,
	IonHeader,
	IonIcon,
	IonList,
	IonMenu,
	IonRouterLink,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { cart, football, gameController, home, list, people } from "ionicons/icons";

export function MenuLateral(props: any): JSX.Element {
	//const nav = useIonRouter(); onClick={() => nav.push("/home", "forward")}

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
					<IonRouterLink href="/home">
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={home}></IonIcon>
								Home
							</IonButton>
						</IonRouterLink>
						<IonRouterLink href="/ligas">
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={gameController}></IonIcon>
								Mis ligas
							</IonButton>
						</IonRouterLink>
						<IonRouterLink href="/clasificacion">
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={list}></IonIcon>
								Clasificacion
							</IonButton>
						</IonRouterLink>
						<IonRouterLink href="/plantilla">
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={people}></IonIcon>
								Plantilla
							</IonButton>
						</IonRouterLink>
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
		</>
	);
}
