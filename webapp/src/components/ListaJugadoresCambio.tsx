import { IonCol, IonContent, IonRow } from "@ionic/react";
import { Jugador, PlantillaUsuario } from "../shared/sharedTypes";

import { CartaDetallesJugador } from "./CartaDetallesJugador";

type ListaJugadoresProps = {
	plantilla: PlantillaUsuario;
	posicion: string;

	jugadores: Jugador[];
};

export function ListaJugadoresCambio(props: ListaJugadoresProps): JSX.Element {
	let jugadoresSuplentes: string[] = [];

	switch (props.posicion.toLowerCase()) {
		case "portero":
			jugadoresSuplentes = props.plantilla.jugadores;
	}

	return (
		<IonContent>
			{props.jugadores.map((j) => (
				<>
					<IonRow key={j._id}>
						<IonCol>
							<CartaDetallesJugador
								key={j._id}
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
