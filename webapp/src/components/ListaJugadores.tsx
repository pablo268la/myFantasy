import { IonCol, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";

import { useEffect, useState } from "react";
import { getJugadoresPorEquipo } from "../api/api";
import { Jugador } from "../shared/sharedTypes";
import { CartaJugador } from "./CartaJugador";

export function ListaJugadores(props: any): JSX.Element {
	const [jugadores, setJugadores] = useState<Jugador[]>();

	const getJugadoresAPI = async () => {
		setJugadores(await getJugadoresPorEquipo("2825"));
	};

	useEffect(() => {
		getJugadoresAPI();
	}, []);
	return (
		<IonPage>
			<IonContent fullscreen>
				<IonGrid>
					<IonRow>
						{jugadores?.map((j) => (
							<IonCol size-lg="3" size-md="4" size-sm="6" key={j._id}>
								<CartaJugador id={j._id} />
							</IonCol>
						))}
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
}
