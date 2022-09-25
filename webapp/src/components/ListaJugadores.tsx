import { IonCol, IonContent, IonRow } from "@ionic/react";

import { CartaDetallesJugador } from "./CartaDetallesJugador";

type ListaJugadoresProps = {
	plantilla: string[];
};

export function ListaJugadores(props: ListaJugadoresProps): JSX.Element {
	const plantilla: string[] = props.plantilla;

	return (
		<IonContent>
			{plantilla.map((j) => (
				<>
					<IonRow key={j}>
						<IonCol>
							<CartaDetallesJugador id={j} />
						</IonCol>
					</IonRow>
				</>
			))}
		</IonContent>
	);
}
