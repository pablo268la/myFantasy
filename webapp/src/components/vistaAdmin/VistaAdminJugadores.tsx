import {
    IonButton,
    IonCol,
    IonLabel,
    IonList,
    IonProgressBar,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonText,
    useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
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
	const [anyEdited, setAnyEdited] = useState<boolean>(false);

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
				<IonRow style={{ justifyContent: "space-around" }}>
					<IonCol>
						<IonRow style={{ justifyContent: "center" }}>
							<IonLabel>
								<IonText>Jugador</IonText>
							</IonLabel>
						</IonRow>
					</IonCol>
					<IonCol style={{ borderInlineStart: "1px solid" }}>
						<IonRow style={{ justifyContent: "center" }}>
							<IonLabel>
								<IonText>Nombre</IonText>
							</IonLabel>
						</IonRow>
					</IonCol>
					<IonCol style={{ borderInlineStart: "1px solid" }}>
						<IonRow style={{ justifyContent: "center" }}>
							<IonLabel>
								<IonText>Valor</IonText>
							</IonLabel>
						</IonRow>
					</IonCol>
					<IonCol style={{ borderInlineStart: "1px solid" }}>
						<IonRow style={{ justifyContent: "center" }}>
							<IonLabel>
								<IonText>Estado</IonText>
							</IonLabel>
						</IonRow>
					</IonCol>
					<IonCol style={{ borderInlineStart: "1px solid" }}>
						<IonRow style={{ justifyContent: "center" }}>
							<IonLabel>
								<IonText>Posicion</IonText>
							</IonLabel>
						</IonRow>
					</IonCol>
					<IonCol style={{ borderInlineStart: "1px solid" }}>
						<IonButton disabled={!anyEdited} color="success">
							Guardar todos
						</IonButton>
					</IonCol>
				</IonRow>

				{!props.loading ? (
					props.jugadores.map((jugador) => (
						<CartaJugadorAdmin
							key={jugador.id}
							jugador={jugador}
							setAnyEdited={setAnyEdited}
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
