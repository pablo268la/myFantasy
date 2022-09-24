import { IonCol, IonContent, IonGrid, IonRow } from "@ionic/react";

import { useEffect, useState } from "react";
import { getJugadoresPorEquipo } from "../api/api";
import { Jugador } from "../shared/sharedTypes";
import { CartaJugador } from "./CartaJugador";

export function ListaJugadores(props: any): JSX.Element {
	const [jugadores, setJugadores] = useState<Jugador[]>();

	const getJugadoresAPI = async () => {
		setJugadores(await getJugadoresPorEquipo("2828"));
	};

	useEffect(() => {
		getJugadoresAPI();
	}, []);
	return (
		<IonContent fullscreen>
			<IonGrid>
				<IonRow>
					{jugadores?.map((j) => (
						<IonCol size-lg="3" size-md="4" size-sm="6" key={j._id}>
							<div style={{ width: 150, height: 120 }}>
								<CartaJugador id={j._id} />
							</div>
						</IonCol>
					))}
				</IonRow>
			</IonGrid>
		</IonContent>
	);
}
