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
import { getPartidosByJornada } from "../../endpoints/partidosController";
import { Partido } from "../../shared/sharedTypes";
import { VistaAdminPuntuacionesLista } from "./VistaAdminPuntuacionesLista";

export function VistaAdminPuntuaciones(props: any): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	useState<boolean>(false);
	const [puntuacionesCambiadas, setPuntuacionesCambiadas] =
		useState<boolean>(false);
	const [guardarPuntuaciones, setGuardarPuntuaciones] =
		useState<boolean>(false);

	const [message, setMessage] = useState<string>("Analizando el Big Data");

	const [jornada, setJornada] = useState<number>(1);
	const [partidos, setPartidos] = useState<Partido[]>([]);
	const [partido, setPartido] = useState<string>();
	const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido>();

	const jornadas = Array.from(Array(38).keys());

	const getPartidosDeJornada = async (jornada: number) => {
		setLoading(true);
		setJornada(jornada);
		await getPartidosByJornada(jornada).then((partidos) => {
			setPartidos(partidos);
		});
		setLoading(false);
	};

	useEffect(() => {
		getPartidosDeJornada(jornada);
	}, []);

	const resetPuntuaciones = () => {
		setMessage("Volviendo a la realidad");

		setPuntuacionesCambiadas(false);
	};

	return (
		<>
			<IonGrid>
				<IonRow>
					<IonLoading isOpen={loading} message={message} />
					<IonCol sizeSm="6" sizeXs="12">
						<IonRow>
							<IonCol size="6">
								<IonSelect
									value={jornada}
									onIonChange={(e) => {
										setMessage("Analizando el Big Data");
										getPartidosDeJornada(e.detail.value);
										setPartido(undefined);
										setPartidoSeleccionado(undefined);
										setGuardarPuntuaciones(false);
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
												setPartidoSeleccionado(
													partidos
														.filter((p) => p._id === e.detail.value)
														.at(0) as Partido
												);
												setMessage("Limpiando los vestuarios");
												setGuardarPuntuaciones(false);
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
													resetPuntuaciones();
												}}
											>
												Reset
											</IonButton>
											<IonButton
												color="success"
												onClick={() => {
													setGuardarPuntuaciones(true);
													setPuntuacionesCambiadas(false);
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

			{!loading && partidoSeleccionado !== undefined ? (
				<>
					<VistaAdminPuntuacionesLista
						partido={partidoSeleccionado}
						jornada={jornada}
						setPuntuacionesCambiadas={setPuntuacionesCambiadas}
						guardarPuntuaciones={guardarPuntuaciones}
					/>
				</>
			) : (
				<></>
			)}
		</>
	);
}
