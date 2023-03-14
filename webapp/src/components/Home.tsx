import {
	IonContent,
	IonHeader,
	IonPage,
	useIonRouter
} from "@ionic/react";
import { FantasyToolbar } from "./comunes/FantasyToolbar";
import { MenuLateral } from "./comunes/MenuLateral";

type HomeProps = {};

export function Home(props: HomeProps): JSX.Element {
	const nav = useIonRouter();

	//alert(isPlatform("desktop") ? "android" : "ios");

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonContent>
					<iframe
						id="sofa-standings-embed-36-42409"
						src="https://www.sofascore.com/es/torneo/36/42409/clasificacion/tablas/introducir"
						style={{ width: "100%", height: "100%" }}
					></iframe>
				</IonContent>
			</IonPage>
		</>
	);
}
