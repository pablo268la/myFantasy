import {
    IonContent,
    IonHeader,
    IonPage,
    IonSegment,
    IonSegmentButton,
    useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getEquipos } from "../../endpoints/equiposEndpoint";
import {
    getJugadores,
    getJugadoresPorEquipo,
} from "../../endpoints/jugadorEndpoints";
import { comparePosiciones } from "../../helpers/helpers";
import { Equipo, Jugador } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { VistaAdminJugadores } from "./VistaAdminJugadores";
import { VistaAdminPartidos } from "./VistaAdminPartidos";
import { VistaAdminPuntuaciones } from "./VistaAdminPuntuaciones";

export function VistaAdmin(): JSX.Element {
	const [equipos, setEquipos] = useState<Equipo[]>([]);
	const [equipoSeleccionado, setEquipoSeleccionado] = useState<
		Equipo | undefined
	>();
	const [jugadores, setJugadores] = useState<Jugador[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [segment, setSegment] = useState<
		"jugadores" | "puntuaciones" | "partidos"
	>("jugadores");

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const getEquiposFromApi = async () => {
		setLoading(true);

		await getEquipos()
			.then((e) =>
				setEquipos(e.sort((a, b) => a.nombre.localeCompare(b.nombre)))
			)
			.catch((err) => {
				crearToast(err, true, "danger");
			});
		setLoading(false);
	};

	const getJugadoresFromApi = async (idEquipo: string, fromModal: boolean) => {
		setLoading(true);
		if (fromModal) {
			idEquipo = equipoSeleccionado?.id || "";
		}
		if (idEquipo === "") {
			await getJugadores()
				.then((j) =>
					setJugadores(
						j.sort((a, b) => a.equipo.nombre.localeCompare(b.equipo.nombre))
					)
				)
				.catch((err) => {
					crearToast(err, true, "danger");
				});
			setEquipoSeleccionado(undefined);
		} else {
			await getJugadoresPorEquipo(idEquipo)
				.then((j) =>
					setJugadores(
						j.sort((a, b) => comparePosiciones(a.posicion, b.posicion))
					)
				)
				.catch((err) => {
					crearToast(err, true, "danger");
				});

			setEquipoSeleccionado(equipos.find((e) => e.id === idEquipo));
		}
		setLoading(false);
	};

	useEffect(() => {
		getEquiposFromApi().catch((err) => {
			crearToast(err, true, "danger");
		});
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
						<IonSegmentButton
							value="partidos"
							onClick={() => {
								setSegment("partidos");
							}}
						>
							Partidos
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
					) : segment === "puntuaciones" ? (
						<>
							<VistaAdminPuntuaciones />
						</>
					) : (
						<>
							<VistaAdminPartidos />
						</>
					)}
				</IonContent>
			</IonPage>
		</>
	);
}
