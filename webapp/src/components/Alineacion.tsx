import { IonRow } from "@ionic/react";
import { PlantillaUsuario } from "../shared/sharedTypes";
import { CartaJugador } from "./CartaJugador";
import { Formacion } from "./VistaPlantilla";

type AlineacionProps = {
	plantilla: PlantillaUsuario;
	formacion: Formacion;
};

export function Alineacion(props: AlineacionProps): JSX.Element {
	console.log(props.formacion);
	return (
		<>
			<IonRow style={{ justifyContent: "center" }}>
				<CartaJugador
					key={props.plantilla.alineacion.portero}
					id={props.plantilla.alineacion.portero}
				/>
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.plantilla.alineacion.defensas
					.slice(0, props.formacion.defensa)
					.map((id) => (
						<CartaJugador key={id} id={id} />
					))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.plantilla.alineacion.medios
					.slice(0, props.formacion.medio)
					.map((id) => (
						<CartaJugador key={id} id={id} />
					))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{props.plantilla.alineacion.delanteros
					.slice(0, props.formacion.delantero)
					.map((id) => (
						<CartaJugador key={id} id={id} />
					))}
			</IonRow>
		</>
	);
}
