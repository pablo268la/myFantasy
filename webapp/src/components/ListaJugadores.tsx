import { IonCol, IonContent, IonRow } from "@ionic/react";

import { useEffect, useState } from "react";
import { getJugadoresPorEquipo } from "../api/api";
import { Jugador } from "../shared/sharedTypes";
import { CartaDetallesJugador } from "./CartaDetallesJugador";

export function ListaJugadores(props: any): JSX.Element {
	const [jugadores, setJugadores] = useState<Jugador[]>();

	const getJugadoresAPI = async () => {
		setJugadores(await getJugadoresPorEquipo("2828"));
	};

	useEffect(() => {
		getJugadoresAPI();
	}, []);

	return (
		<IonContent>
			{jugadores?.map((j) => (
				<>
					<IonRow key={j._id}>
						<IonCol>
							<CartaDetallesJugador id={j._id} />
						</IonCol>
					</IonRow>
				</>
			))}
		</IonContent>
	);
}
