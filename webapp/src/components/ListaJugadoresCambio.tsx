import { IonButton, IonCol, IonContent, IonRow } from "@ionic/react";
import { Jugador, PlantillaUsuario } from "../shared/sharedTypes";

import { CartaDetallesJugador } from "./CartaDetallesJugador";

type ListaJugadoresProps = {
	plantilla: PlantillaUsuario;
	posicion: string;
	jugadores: Jugador[];
};

export function ListaJugadoresCambio(props: ListaJugadoresProps): JSX.Element {
	function getJugadoresACambiar(posicion: string): Jugador[] {
		switch (props.posicion) {
			case "Portero":
				return props.jugadores.filter(
					(jugador) =>
						jugador.posicion === "Portero" &&
						jugador._id !== props.plantilla.alineacion.portero
				);
			case "Defensa":
				return props.jugadores.filter(
					(jugador) =>
						jugador.posicion === "Defensa" &&
						!props.plantilla.alineacion.defensas.includes(jugador._id)
				);
			case "Mediocentro":
				return props.jugadores.filter(
					(jugador) =>
						jugador.posicion === "Mediocentro" &&
						!props.plantilla.alineacion.medios.includes(jugador._id)
				);
			case "Delantero":
				return props.jugadores.filter(
					(jugador) =>
						jugador.posicion === "Delantero" &&
						!props.plantilla.alineacion.delanteros.includes(jugador._id)
				);
			default:
				return [];
		}
	}

	return (
		<>
			<IonContent>
				{getJugadoresACambiar(props.posicion).map((j) => (
					<IonRow key={j._id}>
						<IonCol>
							<CartaDetallesJugador
								key={j._id}
								jugador={j}
								esParaCambio={false}
								plantilla={props.plantilla}
								jugadores={props.jugadores}
							/>
							<IonButton>Seleccionar</IonButton>
						</IonCol>
					</IonRow>
				))}
			</IonContent>
		</>
	);
}
