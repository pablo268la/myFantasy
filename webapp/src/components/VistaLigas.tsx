import { IonContent, IonList } from "@ionic/react";
import { CartaLiga } from "./CartaLiga";

export function VistaLigas(props: any): JSX.Element {
	return (
		<>
			<IonContent>
				<IonList>
					<CartaLiga />
				</IonList>
			</IonContent>
		</>
	);
}
