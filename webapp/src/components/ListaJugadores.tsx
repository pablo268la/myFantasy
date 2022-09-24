import { IonCol, IonContent } from "@ionic/react";

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
				<IonCol key={j._id}>
					<div style={{ width: 150, height: 120 }}>
						<CartaDetallesJugador id={j._id} />
					</div>
				</IonCol>
			))}
		</IonContent>
	);
}
