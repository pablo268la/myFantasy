import {
	IonContent,
	IonHeader,
	IonPage,
	IonSegment,
	IonSegmentButton,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getEquipos } from "../../endpoints/equiposEndpoint";
import {
	getJugadores,
	getJugadoresPorEquipo,
} from "../../endpoints/jugadorEndpoints";
import { Equipo, Jugador } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { VistaAdminJugadores } from "./VistaAdminJugadores";
import { VistaAdminPuntuaciones } from "./VistaAdminPuntuaciones";

export function VistaAdmin(): JSX.Element {
	const [equipos, setEquipos] = useState<Equipo[]>([]);
	const [equipoSeleccionado, setEquipoSeleccionado] = useState<
		Equipo | undefined
	>();
	const [jugadores, setJugadores] = useState<Jugador[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [anyEdited, setAnyEdited] = useState<boolean>(false);

	const [segment, setSegment] = useState<"jugadores" | "puntuaciones">(
		"jugadores"
	);

	const getEquiposFromApi = async () => {
		setLoading(true);
		setEquipos(
			await (
				await getEquipos()
			).sort((a, b) => a.nombre.localeCompare(b.nombre))
		);
		setLoading(false);
	};

	const comparePosiciones = (pos1: string, pos2: string) => {
		if (pos1 === "Portero") {
			return -1;
		}
		if (pos2 === "Portero") {
			return 1;
		}
		if (pos1 === "Defensa") {
			return -1;
		}
		if (pos2 === "Defensa") {
			return 1;
		}
		if (pos1 === "Mediocentro") {
			return -1;
		}
		if (pos2 === "Mediocentro") {
			return 1;
		}
		if (pos1 === "Delantero") {
			return -1;
		}
		if (pos2 === "Delantero") {
			return 1;
		}
		return 0;
	};

	const getJugadoresFromApi = async (idEquipo: string, fromModal: boolean) => {
		setLoading(true);
		if (fromModal) {
			idEquipo = equipoSeleccionado?._id || "";
		}
		if (idEquipo === "") {
			setJugadores(
				await getJugadores().then((j) =>
					j.sort((a, b) => a.equipo.nombre.localeCompare(b.equipo.nombre))
				)
			);
			setEquipoSeleccionado(undefined);
		} else {
			setJugadores(
				await getJugadoresPorEquipo(idEquipo).then((j) =>
					j.sort((a, b) => comparePosiciones(a.posicion, b.posicion))
				)
			);
			setEquipoSeleccionado(equipos.find((e) => e._id === idEquipo));
		}
		setLoading(false);
	};

	useEffect(() => {
		getEquiposFromApi();
	}, []);

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>

				<IonContent>
					<IonSegment value={segment}>
						<IonSegmentButton
							value="jugadores"
							onClick={() => {
								setSegment("jugadores");
							}}
						>
							Jugadores
						</IonSegmentButton>
						<IonSegmentButton
							value="puntuaciones"
							onClick={() => {
								setSegment("puntuaciones");
							}}
						>
							Puntuaciones
						</IonSegmentButton>
					</IonSegment>
					{segment === "jugadores" ? (
						<VistaAdminJugadores
							equipos={equipos}
							equipoSeleccionado={equipoSeleccionado}
							jugadores={jugadores}
							loading={loading}
							compararPosiciones={comparePosiciones}
							getJugadoresFromApi={getJugadoresFromApi}
							getEquiposFromApi={getEquiposFromApi}
						/>
					) : (
						<>
							<VistaAdminPuntuaciones />
						</>
					)}
				</IonContent>
			</IonPage>
		</>
	);
}
