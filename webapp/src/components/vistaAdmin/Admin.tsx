import {
	IonButton,
	IonCol,
	IonContent,
	IonHeader,
	IonLabel,
	IonList,
	IonPage,
	IonProgressBar,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonText,
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
import { CartaJugadorAdmin } from "./CartaJugadorAdmin";

export function Admin(): JSX.Element {
	const [equipos, setEquipos] = useState<Equipo[]>([]);
	const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>();
	const [jugadores, setJugadores] = useState<Jugador[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [anyEdited, setAnyEdited] = useState<boolean>(false);

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
			setEquipoSeleccionado(null);
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
					<IonRow>
						<IonSelect
							placeholder="Selecciona un equipo"
							onIonChange={(e) => {
								getJugadoresFromApi(`${e.detail.value}`, false);
							}}
						>
							<IonSelectOption key={""} value={""}>
								Todos
							</IonSelectOption>
							{equipos.map((equipo) => (
								<IonSelectOption key={equipo._id} value={equipo._id}>
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

						{!loading ? (
							jugadores.map((jugador) => (
								<CartaJugadorAdmin
									key={jugador._id}
									jugador={jugador}
									setAnyEdited={setAnyEdited}
									equipos={equipos}
									getJugadoresFromApi={getJugadoresFromApi}
								/>
							))
						) : (
							<IonProgressBar
								style={{ background: "#f4f544", progressBackground: "#562765" }}
								type="indeterminate"
							></IonProgressBar>
						)}
					</IonList>
				</IonContent>
			</IonPage>
		</>
	);
}
