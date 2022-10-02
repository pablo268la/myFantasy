import { IonButton, IonCol, IonContent, IonRow } from "@ionic/react";
import { JugadorTitular } from "../shared/sharedTypes";

import { CartaDetallesJugador } from "./CartaDetallesJugador";
import { Formacion } from "./VistaPlantilla";

type ListaJugadoresCambioProps = {
	idJugador: string;
	posicion: string;
	porteros: JugadorTitular[];
	defensas: JugadorTitular[];
	mediocentros: JugadorTitular[];
	delanteros: JugadorTitular[];
	formacion: Formacion;
	cambiarTitulares: (
		lista: JugadorTitular[],
		idIn: string,
		idOut: string
	) => void;
};

export function ListaJugadoresCambio(
	props: ListaJugadoresCambioProps
): JSX.Element {
	function getJugadoresACambiar(posicion: string): JugadorTitular[] {
		switch (posicion) {
			case "Portero":
				return props.porteros.slice(1);
			case "Defensa":
				return props.defensas.filter((j) => !j.titular);
			case "Mediocentro":
				return props.mediocentros.filter((j) => !j.titular);
			case "Delantero":
				return props.delanteros.filter((j) => !j.titular);
			default:
				return [];
		}
	}
	function getLista(posicion: string): JugadorTitular[] {
		switch (posicion) {
			case "Portero":
				return props.porteros;
			case "Defensa":
				return props.defensas;
			case "Mediocentro":
				return props.mediocentros;
			case "Delantero":
				return props.delanteros;
			default:
				return [];
		}
	}

	return (
		<>
			<IonContent>
				{getJugadoresACambiar(props.posicion).map((j) => (
					<IonRow key={j.jugador._id}>
						<IonCol>
							<CartaDetallesJugador
								key={j.jugador._id}
								jugador={j}
								esParaCambio={false}
								porteros={props.porteros}
								defensas={props.defensas}
								mediocentros={props.mediocentros}
								delanteros={props.delanteros}
								formacion={props.formacion}
								cambiarTitulares={props.cambiarTitulares}
							/>
							<IonButton
								onClick={() =>
									props.cambiarTitulares(
										getLista(props.posicion),
										j.jugador._id,
										props.idJugador
									)
								}
							>
								Seleccionar
							</IonButton>
						</IonCol>
					</IonRow>
				))}
			</IonContent>
		</>
	);
}
