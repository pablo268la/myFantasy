import { IonContent, IonPage } from "@ionic/react";
import { ListaJugadores } from "../components/ListaJugadores";
import "./Tab1.css";

const Tab1: React.FC = () => {
	const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	return (
		<IonPage>
			<IonContent fullscreen>
				<ListaJugadores />
			</IonContent>
		</IonPage>
	);
};

export default Tab1;
