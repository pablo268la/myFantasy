import {
	IonContent,
	IonGrid,
	IonImg,
	IonLabel,
	IonPage,
	IonRow,
	IonSlide,
	IonSlides,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getJugadorById } from "../../endpoints/jugadorEndpoints";
import { getPlantilla } from "../../endpoints/plantillaEndpoints";
import { getUsuarioLogueado, ponerPuntosAValor } from "../../helpers/helpers";
import { Jugador, PlantillaUsuario } from "../../shared/sharedTypes";

export function PlantillaStart(): JSX.Element {
	const slideOpts = {
		initialSlide: 0,
		speed: 400,
	};

	async function getJugadores() {
		const jugadores: Jugador[] = [];
		const plantilla: PlantillaUsuario = await getPlantilla(
			window.location.pathname.split("/")[3],
			getUsuarioLogueado()?.id as string
		);

		for (let i = 0; i < plantilla.alineacionJugador.delanteros.length; i++) {
			const jugador = await getJugadorById(
				plantilla.alineacionJugador.delanteros[i].idJugador
			);
			jugadores.push(jugador);
		}
		for (let i = 0; i < plantilla.alineacionJugador.medios.length; i++) {
			const jugador = await getJugadorById(
				plantilla.alineacionJugador.medios[i].idJugador
			);
			jugadores.push(jugador);
		}
		for (let i = 0; i < plantilla.alineacionJugador.defensas.length; i++) {
			const jugador = await getJugadorById(
				plantilla.alineacionJugador.defensas[i].idJugador
			);
			jugadores.push(jugador);
		}
		for (let i = 0; i < plantilla.alineacionJugador.porteros.length; i++) {
			const jugador = await getJugadorById(
				plantilla.alineacionJugador.porteros[i].idJugador
			);
			jugadores.push(jugador);
		}

		setJugadores(jugadores);
	}

	useEffect(() => {
		getJugadores();
	}, []);

	const [juagadores, setJugadores] = useState<Jugador[]>([]);

	return (
		<IonPage>
			<IonContent>
				<IonSlides
					style={{ border: "2px solid #123445", width: 500 }}
					pager={true}
					options={slideOpts}
				>
					{juagadores.map((jugador) => (
						<>
							<IonSlide>
								<IonGrid style={{ backgroundColor: "#45938a" }}>
									<IonRow style={{ justifyContent: "center" }}>
										<IonLabel> {jugador.posicion}</IonLabel>
									</IonRow>
									<IonRow style={{ justifyContent: "center", margin: 30 }}>
										<IonImg src={jugador.foto}></IonImg>
									</IonRow>
									<IonRow
										style={{
											marginTop: 10,
											justifyContent: "space-around",
											alignContent: "center",
										}}
									>
										<IonLabel>{jugador.nombre}</IonLabel>
										<IonLabel>{ponerPuntosAValor(jugador.valor)}</IonLabel>
									</IonRow>
								</IonGrid>
							</IonSlide>
						</>
					))}
				</IonSlides>
			</IonContent>
		</IonPage>
	);
}
