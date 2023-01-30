import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonRouter
} from "@ionic/react";
import { MenuLateral } from "./comunes/MenuLateral";

type HomeProps = {};

export function Home(props: HomeProps): JSX.Element {
	const nav = useIonRouter();

	return (
		<>
			<MenuLateral />
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
					
				</IonContent>
			</IonPage>
		</>
	);
}
