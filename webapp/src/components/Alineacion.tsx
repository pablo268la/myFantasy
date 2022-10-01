import { IonRow } from "@ionic/react";
import { useEffect, useState } from "react";
import { getAlineacionJugador } from "../api/api";
import { AlineacionJugador, PlantillaUsuario } from "../shared/sharedTypes";
import { CartaJugador } from "./CartaJugador";
import { Formacion } from "./VistaPlantilla";

type AlineacionProps = {
	plantilla: PlantillaUsuario;
	formacion: Formacion;
};

export function Alineacion(props: AlineacionProps): JSX.Element {
	const [alineacionJugador, setAlineacionJugador] =
		useState<AlineacionJugador>();

	const getAPI = async () => {
		await getAlineacionJugador().then((res) => {
			setAlineacionJugador(res[0]);
		});
		console.log(alineacionJugador);
	};

	useEffect(() => {
		getAPI();
	}, []);

	return (
		<>
			<IonRow style={{ justifyContent: "center" }}>
				{props.plantilla?.jugadores.slice(0, 1).map((id) => (
					<CartaJugador key={id} id={id} />
				))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{alineacionJugador?.defensas.map((id) => (
					<CartaJugador key={id} id={id} />
				))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{alineacionJugador?.medios.map((id) => (
					<CartaJugador key={id} id={id} />
				))}
			</IonRow>
			<IonRow style={{ justifyContent: "space-around" }}>
				{alineacionJugador?.delanteros.map((id) => (
					<CartaJugador key={id} id={id} />
				))}
			</IonRow>
		</>
	);
}
