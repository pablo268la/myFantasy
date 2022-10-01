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
			{props.jugadores.sort(ordenarListaJugadoresPorPosicion()).map((j) => (
				<IonRow key={j._id}>
					<IonCol>
						<CartaDetallesJugador
							jugador={j}
							esParaCambio={false}
							plantilla={props.plantilla}
							jugadores={props.jugadores}
						/>
					</IonCol>
				</IonRow>
			))}
		</IonContent>
	);
}

export function ordenarListaJugadoresPorPosicion():
	| ((a: Jugador, b: Jugador) => number)
	| undefined {
	return (a, b) => {
		if (a.posicion === "Portero") return -1;
		else if (
			a.posicion === "Defensa" &&
			(b.posicion === "Defensa" ||
				b.posicion === "Mediocentro" ||
				b.posicion === "Delantero")
		)
			return -1;
		else if (
			a.posicion === "Mediocentro" &&
			(b.posicion === "Mediocentro" || b.posicion === "Delantero")
		)
			return -1;
		else if (a.posicion === "Delantero" && b.posicion === "Delantero")
			return -1;
		else return 1;
	};
}
