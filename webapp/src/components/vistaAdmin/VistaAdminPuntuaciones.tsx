import {
	IonButton,
	IonCol,
	IonGrid,
	IonItem,
	IonLabel,
	IonLoading,
	IonRow,
	IonSelect,
	IonSelectOption,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
	getPartidosByJornada,
	getPuntuacionesPartido,
} from "../../endpoints/partidosController";
import {
	getPuntuacionJugador,
	guardarPuntuacionJugador,
} from "../../endpoints/puntuacionesController";
import { Partido, PuntuacionJugador } from "../../shared/sharedTypes";
import { VistaAdminListaPuntuaciones } from "./VistaAdminListaPuntuaciones";

export function VistaAdminPuntuaciones(props: any): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingPuntuaciones, setLoadingPuntuaciones] =
		useState<boolean>(false);
	const [puntuacionesCambiadas, setPuntuacionesCambiadas] =
		useState<boolean>(false);

	const [message, setMessage] = useState<string>("Analizando el Big Data");

	const [jornada, setJornada] = useState<number>(1);
	const [partidos, setPartidos] = useState<Partido[]>([]);
	const [partido, setPartido] = useState<string>();

	const jornadas = Array.from(Array(38).keys());

	const [puntuacionesPartido, setPuntuacionesPartido] = useState<
		PuntuacionJugador[]
	>([]);
	const [changedPuntuaciones, setChangedPuntuaciones] = useState<
		PuntuacionJugador[]
	>([]);

	const addChangedPuntuacion = (puntuacion: PuntuacionJugador) => {
		if (!changedPuntuaciones.find((p) => p.idJugador === puntuacion.idJugador))
			setChangedPuntuaciones([...changedPuntuaciones, puntuacion]);
		else setChangedPuntuaciones([...changedPuntuaciones]);
	};

	const deleteChangedPuntuacion = async (puntuacion: PuntuacionJugador) => {
		let oldP = changedPuntuaciones
			.filter((p) => p.idJugador === puntuacion.idJugador)
			.at(0);

		if (oldP === undefined) {
			oldP = await getPuntuacionJugador(puntuacion.idJugador).then((p) => {
				return p.find((p) => p.idPartido === partido);
			});
			setChangedPuntuaciones(
				changedPuntuaciones.filter((p) => p.idJugador !== puntuacion.idJugador)
			);
			setPuntuacionesPartido(
				puntuacionesPartido.map((p) => {
					if (p.idJugador === puntuacion.idJugador) {
						return oldP;
					}
					return p;
				}) as PuntuacionJugador[]
			);
		}
	};

	const getPuntuacionesPartidoBack = async (partido: string) => {
		setLoadingPuntuaciones(true);
		await getPuntuacionesPartido(partido).then((puntuaciones) => {
			setPuntuacionesPartido(puntuaciones);
		});
		setLoadingPuntuaciones(false);
	};

	const getPartidosDeJornada = async (jornada: number) => {
		setLoading(true);
		setJornada(jornada);
		await getPartidosByJornada(jornada).then((partidos) => {
			setPartidos(partidos);
		});
		setLoading(false);
	};

	const guardarPuntuaciones = async () => {
		// TODO - Guardar las puntuaciones que devuelva el back como actuales
		setLoading(true);
		puntuacionesPartido.forEach(async (puntuacion) => {
			await guardarPuntuacionJugador(puntuacion);
		});
		setLoading(false);
		setPuntuacionesCambiadas(false);
		setChangedPuntuaciones([]);
		getPuntuacionesPartidoBack(partido as string);
	};

	useEffect(() => {
		getPartidosDeJornada(jornada);
	}, []);

	return (
		<>
			<IonGrid>
				<IonRow>
					<IonLoading isOpen={loading} message={message} />
					<IonLoading isOpen={loadingPuntuaciones} message={message} />
					<IonCol sizeSm="6" sizeXs="12">
						<IonRow>
							<IonCol size="6">
								<IonSelect
									value={jornada}
									onIonChange={(e) => {
										setMessage("Analizando el Big Data");
										getPartidosDeJornada(e.detail.value);
										setPartido(undefined);
									}}
								>
									{jornadas.map((jornada) => (
										<IonSelectOption key={jornada + 1} value={jornada + 1}>
											Jornada {jornada + 1}
										</IonSelectOption>
									))}
								</IonSelect>
							</IonCol>
							<IonCol size="6">
								{!loading ? (
									<>
										<IonSelect
											placeholder="Selecciona un partido"
											interface="action-sheet"
											onIonChange={(e) => {
												setPartido(e.detail.value);
												setMessage("Limpiando los vestuarios");
												getPuntuacionesPartidoBack(e.detail.value);
											}}
										>
											{partidos.map((p) => (
												<IonSelectOption key={p._id} value={p._id}>
													{p.local.nombre} {p.resultadoLocal} -{" "}
													{p.resultadoVisitante} {p.visitante.nombre}
												</IonSelectOption>
											))}
										</IonSelect>
									</>
								) : (
									<></>
								)}
							</IonCol>
						</IonRow>
					</IonCol>
					<IonCol>
						{partido !== undefined ? (
							<>
								<IonRow>
									<IonCol size="5">
										<IonItem lines="none">
											<a
												target="_blank"
												href={
													partidos.filter((p) => p._id === partido).at(0)
														?.linkSofaScore
												}
												rel="noreferrer"
											>
												<IonLabel>Link SofaScore</IonLabel>
											</a>
										</IonItem>
									</IonCol>
									{puntuacionesCambiadas ? (
										<IonCol size="7" className="ion-text-end">
											<IonButton
												color="danger"
												onClick={() => {
													setMessage("Volviendo a la realidad");
													getPuntuacionesPartidoBack(partido);
													setPuntuacionesCambiadas(false);
												}}
											>
												Reset
											</IonButton>
											<IonButton
												color="success"
												onClick={() => {
													guardarPuntuaciones();
												}}
											>
												Guardar
											</IonButton>
										</IonCol>
									) : (
										<></>
									)}
								</IonRow>
							</>
						) : (
							<></>
						)}
					</IonCol>
				</IonRow>
			</IonGrid>

			{!loading && partido !== undefined ? (
				<>
					<VistaAdminListaPuntuaciones
						partido={partidos.filter((p) => p._id === partido).at(0) as Partido}
						jornada={jornada}
						puntuacionesPartido={puntuacionesPartido}
						setPuntuacionesCambiadas={setPuntuacionesCambiadas}
						addChangedPuntuacion={addChangedPuntuacion}
						deleteChangedPuntuacion={deleteChangedPuntuacion}
					/>
				</>
			) : (
				<></>
			)}
		</>
	);
}
