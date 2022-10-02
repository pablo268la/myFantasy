import { IonButton, IonContent } from "@ionic/react";
import { useEffect, useState } from "react";
import { getJugadorById, getPlantilla } from "../api/api";
import { JugadorTitular, PlantillaUsuario } from "../shared/sharedTypes";
import {
    ordenarListaJugadoresPorTitular
} from "./VistaPlantilla";

export function Home(props: any): JSX.Element {
	const [plantilla, setPlantilla] = useState<PlantillaUsuario>();

	const [jugadores, setJugadores] = useState<JugadorTitular[]>([]);
	const [porteros, setPorteros] = useState<JugadorTitular[]>([]);
	const [defensas, setDefensas] = useState<JugadorTitular[]>([]);
	const [mediocentros, setMediocentros] = useState<JugadorTitular[]>([]);
	const [delanteros, setDelanteros] = useState<JugadorTitular[]>([]);

	const getJugadoresAPI = async () => {
		await getPlantilla().then((res) => {
			setPlantilla(res[0]);

			let ju: JugadorTitular[] = [];
			let po: JugadorTitular[] = [];
			let de: JugadorTitular[] = [];
			let me: JugadorTitular[] = [];
			let dl: JugadorTitular[] = [];

			res[0].alineacionJugador.porteros.forEach(
				async (tupple: { idJugador: any; enPlantilla: any }) => {
					let j = await getJugadorById(tupple.idJugador);
					po.push({ jugador: j, titular: tupple.enPlantilla });

					ju.push({ jugador: j, titular: tupple.enPlantilla });
					po.sort(ordenarListaJugadoresPorTitular());
					setPorteros(po);
				}
			);
			res[0].alineacionJugador.defensas.forEach(
				async (tupple: { idJugador: any; enPlantilla: any }) => {
					let j = await getJugadorById(tupple.idJugador);
					de.push({ jugador: j, titular: tupple.enPlantilla });
					ju.push({ jugador: j, titular: tupple.enPlantilla });
					de.sort(ordenarListaJugadoresPorTitular());
					setDefensas(de);
				}
			);
			res[0].alineacionJugador.medios.forEach(
				async (tupple: { idJugador: any; enPlantilla: any }) => {
					let j = await getJugadorById(tupple.idJugador);
					me.push({ jugador: j, titular: tupple.enPlantilla });
					ju.push({ jugador: j, titular: tupple.enPlantilla });
					me.sort(ordenarListaJugadoresPorTitular());
					setMediocentros(me);
				}
			);
			res[0].alineacionJugador.delanteros.forEach(
				async (tupple: { idJugador: any; enPlantilla: any }) => {
					let j = await getJugadorById(tupple.idJugador);
					dl.push({ jugador: j, titular: tupple.enPlantilla });
					ju.push({ jugador: j, titular: tupple.enPlantilla });
					dl.sort(ordenarListaJugadoresPorTitular());
					setDelanteros(dl);
				}
			);
			setJugadores(ju);
		});
	};

	useEffect(() => {
		getJugadoresAPI();
	}, []);

	return (
		<>
			<IonContent>
				<IonButton href="/plantilla"> Plantilla</IonButton>
			</IonContent>
		</>
	);
}
