import { IonRow } from "@ionic/react";
import { Jugador, PlantillaUsuario } from "../shared/sharedTypes";
import { CartaJugador } from "./CartaJugador";
import { Formacion } from "./VistaPlantilla";

type AlineacionProps = {
	plantilla: PlantillaUsuario;
	formacion: Formacion;
	setJugadorPulsado: (idJugador: string) => void;
	jugadores: Jugador[];
};

export function Alineacion(props: AlineacionProps): JSX.Element {
	console.log(props.jugadores);
	return (
		<>
			<IonRow style={{ justifyContent: "center" }}>
				<CartaJugador
					key={props.plantilla.alineacion.portero}
					jugador={props.jugadores.find(
						(j) => j._id === props.plantilla.alineacion.portero
					)}
					setJugadorPulsado={props.setJugadorPulsado}
					posicion={"portero"}
				/>
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.plantilla.alineacion.defensas
					.slice(0, props.formacion.defensa)
					.map((id) => (
						<CartaJugador
							key={id}
							jugador={props.jugadores.find((j) => j._id === id)}
							setJugadorPulsado={props.setJugadorPulsado}
							posicion={"defensa"}
						/>
					))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.plantilla.alineacion.medios
					.slice(0, props.formacion.medio)
					.map((id) => (
						<CartaJugador
							key={id}
							jugador={props.jugadores.find((j) => j._id === id)}
							setJugadorPulsado={props.setJugadorPulsado}
							posicion={"mediocentro"}
						/>
					))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.plantilla.alineacion.delanteros
					.slice(0, props.formacion.delantero)
					.map((id) => (
						<CartaJugador
							key={id}
							jugador={props.jugadores.find((j) => j._id === id)}
							setJugadorPulsado={props.setJugadorPulsado}
							posicion={"delantero"}
						/>
					))}
			</IonRow>
		</>
	);
}
