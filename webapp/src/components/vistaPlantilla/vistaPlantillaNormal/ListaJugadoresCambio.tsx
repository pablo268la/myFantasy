import { IonButton, IonCol, IonRow } from "@ionic/react";

import { PropiedadJugador } from "../../../shared/sharedTypes";
import { Formacion } from "../VistaPlantilla";
import { CartaDetallesJugador } from "./CartaDetallesJugador";

type ListaJugadoresCambioProps = {
	idJugador: string;
	posicion: string;
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	formacion: Formacion;
	cambiarTitulares: (
		lista: PropiedadJugador[],
		idIn: string,
		idOut: string
	) => void;
	isSameUser: boolean;
};

export function ListaJugadoresCambio(
	props: ListaJugadoresCambioProps
): JSX.Element {
	function getJugadoresACambiar(posicion: string): PropiedadJugador[] {
		switch (posicion) {
			case "Portero":
				return props.porteros.filter(
					(j) => !j.titular && j.jugador._id !== "empty"
				);
			case "Defensa":
				return props.defensas.filter(
					(j) => !j.titular && j.jugador._id !== "empty"
				);
			case "Mediocentro":
				return props.mediocentros.filter(
					(j) => !j.titular && j.jugador._id !== "empty"
				);
			case "Delantero":
				return props.delanteros.filter(
					(j) => !j.titular && j.jugador._id !== "empty"
				);
			default:
				return [];
		}
	}
	function getLista(posicion: string): PropiedadJugador[] {
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
			{getJugadoresACambiar(props.posicion).map((j) => (
				<IonRow key={j.jugador._id}>
					<IonCol>
						<CartaDetallesJugador
							key={j.jugador._id}
							propiedadJugador={j}
							esParaCambio={false}
							porteros={props.porteros}
							defensas={props.defensas}
							mediocentros={props.mediocentros}
							delanteros={props.delanteros}
							formacion={props.formacion}
							cambiarTitulares={props.cambiarTitulares}
							isSameUser={props.isSameUser}
							setJugadorSeleccionadoMethod={() => {}}
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
		</>
	);
}