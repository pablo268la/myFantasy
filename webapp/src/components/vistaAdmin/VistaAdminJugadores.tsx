import {
	IonList,
	IonProgressBar,
	IonRow,
	IonSelect,
	IonSelectOption,
	useIonToast
} from "@ionic/react";
import { useEffect } from "react";
import { Equipo, Jugador } from "../../shared/sharedTypes";
import { CartaJugadorAdmin } from "./CartaJugadorAdmin";

type VistaAdminJugadoresProps = {
	equipos: Equipo[];
	equipoSeleccionado: Equipo | undefined;
	jugadores: Jugador[];
	loading: boolean;
	getEquiposFromApi: () => Promise<void>;
	compararPosiciones: (pos1: string, pos2: string) => number;
	getJugadoresFromApi: (equipoId: string, anyEdited: boolean) => Promise<void>;
};

export function VistaAdminJugadores(
	props: VistaAdminJugadoresProps
): JSX.Element {
	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	useEffect(() => {
		props.getEquiposFromApi().catch((err) => {
			crearToast(err.message, true, "danger");
		});
	}, []);

	return (
		<>
			<IonRow>
				<IonSelect
					placeholder="Selecciona un equipo"
					onIonChange={(e) => {
						props
							.getJugadoresFromApi(`${e.detail.value}`, false)
							.catch((err) => {
								crearToast(err.message, true, "danger");
							});
					}}
					value={props.equipoSeleccionado ? props.equipoSeleccionado.id : null}
				>
					<IonSelectOption key={""} value={""}>
						Todos
					</IonSelectOption>
					{props.equipos.map((equipo) => (
						<IonSelectOption key={equipo.id} value={equipo.id}>
							{equipo.nombre}
						</IonSelectOption>
					))}
					<IonSelectOption key={"-1"} value={"-1"}>
						Sin equipo
					</IonSelectOption>
				</IonSelect>
			</IonRow>
			<IonList>
				{!props.loading ? (
					props.jugadores.map((jugador) => (
						<CartaJugadorAdmin
							key={jugador.id}
							jugador={jugador}
							equipos={props.equipos}
						/>
					))
				) : (
					<IonProgressBar
						style={{ background: "#f4f544", progressBackground: "#562765" }}
						type="indeterminate"
					></IonProgressBar>
				)}
			</IonList>
		</>
	);
}
