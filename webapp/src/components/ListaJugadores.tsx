import { IonCol, IonContent, IonRow } from "@ionic/react";
import { Jugador, PlantillaUsuario } from "../shared/sharedTypes";

import { CartaDetallesJugador } from "./CartaDetallesJugador";

type ListaJugadoresProps = {
	plantilla: PlantillaUsuario;
	jugadores: Jugador[];
};

export function ListaJugadores(props: ListaJugadoresProps): JSX.Element {
	const plantilla: PlantillaUsuario = props.plantilla;

	return (
		<IonContent>
			{props.jugadores.map((j) => (
				<>
					<IonRow key={j._id}>
						<IonCol>
							<CartaDetallesJugador
								jugador={j}
								esParaCambio={false}
								plantilla={props.plantilla}
							/>
						</IonCol>
					</IonRow>
				</>
			))}
		</IonContent>
	);
}
