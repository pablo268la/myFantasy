import {
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonDatetime,
	IonDatetimeButton,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonLoading,
	IonModal,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { addCircleOutline, arrowForwardCircle, trash } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { getJugadoresPorEquipo } from "../../endpoints/jugadorEndpoints";
import {
	getPartidosByJornada,
	updatePartido,
} from "../../endpoints/partidosController";
import {
	Alineacion,
	EventoPartido,
	Jugador,
	Partido,
} from "../../shared/sharedTypes";
import { PartidosLista } from "./PartidosLista";

export function VistaAdminPartidos(props: any): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("Analizando el Big Data");

	const [jornada, setJornada] = useState<number>(1);
	const [partidos, setPartidos] = useState<Partido[]>([]);
	const [partido, setPartido] = useState<string>();
	const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido>();

	const jornadas = Array.from(Array(38).keys());

	const [jugadoresLocales, setJugadoresLocales] = useState<Jugador[]>([]);
	const [jugadoresVisitantes, setJugadoresVisitantes] = useState<Jugador[]>([]);

	const [cambiado, setCambiado] = useState<boolean>(false);
	const [alineacionLocal, setAlineacionLocal] = useState<Alineacion>();
	const [alineacionVisitante, setAlineacionVisitante] = useState<Alineacion>();
	const [estado, setEstado] = useState<string>();
	const [fecha, setFecha] = useState<string>();
	const [link, setLink] = useState<string>();
	const [eventosPartido, setEventosPartido] = useState<EventoPartido[]>([]);

	const modalEvento = useRef<HTMLIonModalElement>(null);
	const [showModalEvento, setShowModalEvento] = useState<boolean>(false);

	const [tipoEvento, setTipoEvento] = useState<string>();
	const [minutoEvento, setMinutoEvento] = useState<number>(0);
	const [jugadorEvento, setJugadorEvento] = useState<Jugador>();
	const [jugadorEvento2, setJugadorEvento2] = useState<Jugador>();

	const getPartidosDeJornada = async (jornada: number) => {
		setLoading(true);
		setCambiado(false);
		setJornada(jornada);
		await getPartidosByJornada(jornada).then((partidos) => {
			setPartidos(partidos);
		});
		setLoading(false);
	};

	const changeSelectedPartido = async (partido: any) => {
		setLoading(true);
		setPartido(partido);
		if (partido === undefined) setPartidoSeleccionado(undefined);
		else {
			const p = partidos.filter((p) => p._id === partido).at(0);
			if (p) {
				setPartidoSeleccionado(p);
				getJugadoresPorEquipo(p.local._id).then((jugadores) =>
					setJugadoresLocales(jugadores)
				);
				getJugadoresPorEquipo(p.visitante._id).then((jugadores) =>
					setJugadoresVisitantes(jugadores)
				);
				setAlineacionLocal(p.alineacionLocal);
				setAlineacionVisitante(p.alineacionVisitante);
				setEstado(p.estado);
				setFecha(p.fecha);
				setLink(p.linkSofaScore);
			} else setPartidoSeleccionado(undefined);
		}
		setCambiado(false);
		setLoading(false);
	};

	const guardarAlineacion = async () => {
		setLoading(true);
		if (partidoSeleccionado) {
			if (alineacionLocal)
				partidoSeleccionado.alineacionLocal = alineacionLocal;
			if (alineacionVisitante)
				partidoSeleccionado.alineacionVisitante = alineacionVisitante;
			if (estado) partidoSeleccionado.estado = estado;
			if (fecha) partidoSeleccionado.fecha = fecha;
			if (link) partidoSeleccionado.linkSofaScore = link;

			updatePartido(partidoSeleccionado).then((p) => {
				setPartidoSeleccionado(p);
			});
			setPartidos(
				partidos.map((p) => {
					if (p._id === partidoSeleccionado._id) return partidoSeleccionado;
					else return p;
				})
			);
		}
		setCambiado(false);
		setLoading(false);
	};

	useEffect(() => {
		getPartidosDeJornada(jornada);
	}, []);

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
										changeSelectedPartido(undefined);
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
											onIonChange={async (e) => {
												await changeSelectedPartido(e.detail.value);
												setMessage("Buscando los resumenes");
											}}
										>
											{partidos.map((p) => (
												<IonSelectOption key={p._id} value={p._id}>
													{p.local.nombre} - {p.visitante.nombre}
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
									{cambiado ? (
										<IonCol className="ion-text-end">
											<IonButton
												color="danger"
												onClick={() => {
													setMessage("Volviendo a la realidad");
													changeSelectedPartido(partido);
													setCambiado(false);
												}}
											>
												Reset
											</IonButton>
											<IonButton
												color="success"
												onClick={() => {
													guardarAlineacion();
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
					<IonItemDivider>Informacion</IonItemDivider>
					<IonRow>
						<IonCol sizeSm="4" sizeXs="6">
							<IonItem lines="none">
								<IonLabel position="stacked">Estado</IonLabel>
								<IonSelect
									value={estado}
									onIonChange={(e) => {
										setCambiado(true);
										setEstado(e.detail.value);
									}}
								>
									<IonSelectOption value="Por jugar">Por jugar</IonSelectOption>
									<IonSelectOption value="En juego">En juego</IonSelectOption>
									<IonSelectOption value="Finalizado">
										Finalizado
									</IonSelectOption>
									<IonSelectOption value="Cancelado">Cancelado</IonSelectOption>
								</IonSelect>
							</IonItem>
						</IonCol>
						<IonCol sizeSm="4" sizeXs="6">
							<IonItem lines="none">
								<IonLabel position="stacked">Link SofaScore</IonLabel>
								<IonInput
									value={link}
									onIonChange={(e) => {
										if (e.detail.value !== partidoSeleccionado.linkSofaScore)
											setCambiado(true);
										setLink(e.detail.value + "");
									}}
								></IonInput>
							</IonItem>
						</IonCol>
						<IonCol sizeSm="4" sizeXs="12">
							<IonItem lines="none">
								<IonLabel position="stacked">Fecha</IonLabel>
								<IonDatetimeButton datetime="datetime"></IonDatetimeButton>
							</IonItem>
							<IonModal
								keepContentsMounted={true}
								onDidDismiss={() => {
									setCambiado(true);
								}}
							>
								<IonDatetime
									onIonChange={(e) => {
										setFecha(e.detail.value + "");
									}}
									showDefaultButtons={true}
									value={new Date(Date.parse(fecha + "")).toISOString()}
									minuteValues="00,15,30,45"
									id="datetime"
								></IonDatetime>
							</IonModal>
						</IonCol>
					</IonRow>

					<IonItemDivider>Eventos</IonItemDivider>

					<IonRow>
						<IonCol sizeSm="1" sizeXs="2">
							<IonButton
								fill="clear"
								onClick={() => {
									setShowModalEvento(true);
								}}
							>
								<IonIcon icon={addCircleOutline} size="large" />
							</IonButton>
						</IonCol>

						<IonCol sizeSm="11" sizeXs="10">
							<IonRow>
								{eventosPartido.map((evento) => (
									<IonItem key={evento.minuto}>
										<IonLabel>
											{evento.minuto}
											{"' | "}
											{evento.tipo}
											{"  "}
											{evento.jugador !== undefined
												? evento.jugador.nombre
												: ""}
											{evento.jugador2 !== undefined ? (
												<>
													{" "}
													<IonIcon icon={arrowForwardCircle} />{" "}
													{evento.jugador2.nombre}
												</>
											) : (
												""
											)}
										</IonLabel>
										<IonButton
											fill="clear"
											onClick={() => {
												setEventosPartido(
													eventosPartido.filter((e) => e !== evento)
												);
											}}
										>
											<IonIcon icon={trash} />
										</IonButton>
									</IonItem>
								))}
							</IonRow>
						</IonCol>

						<IonModal
							ref={modalEvento}
							isOpen={showModalEvento}
							onDidDismiss={() => {
								setShowModalEvento(false);
							}}
						>
							<IonHeader>
								<IonToolbar>
									<IonButtons slot="start">
										<IonButton
											onClick={() => {
												modalEvento.current?.dismiss();
											}}
										>
											Cancel
										</IonButton>
									</IonButtons>
									<IonTitle>
										<IonRow className="ion-justify-content-center">
											Evento
										</IonRow>
									</IonTitle>
									<IonButtons slot="end">
										<IonButton
											onClick={() => {
												if (
													jugadorEvento === undefined ||
													minutoEvento === undefined ||
													tipoEvento === undefined
												)
													return;

												setEventosPartido([
													...eventosPartido,
													{
														tipo: tipoEvento + "",
														minuto: minutoEvento,
														jugador: jugadorEvento as Jugador,
														jugador2: jugadorEvento2,
													},
												]);
												setJugadorEvento(undefined);
												setJugadorEvento2(undefined);
												setMinutoEvento(0);
												setTipoEvento(undefined);
												modalEvento.current?.dismiss();
											}}
										>
											Guardar
										</IonButton>
									</IonButtons>
								</IonToolbar>
							</IonHeader>
							<IonContent>
								<IonItem>
									<IonLabel position="stacked">Tipo de evento</IonLabel>
									<IonSelect
										value={tipoEvento}
										onIonChange={(e) => {
											setTipoEvento(e.detail.value);
										}}
									>
										<IonSelectOption value="Gol">Gol</IonSelectOption>
										<IonSelectOption value="Asistencia">
											Asistencia
										</IonSelectOption>
										<IonSelectOption value="Gol en propia puerta">
											Gol en propia puerta
										</IonSelectOption>
										<IonSelectOption value="Tarjeta amarilla">
											Tarjeta amarilla
										</IonSelectOption>
										<IonSelectOption value="Tarjeta roja">
											Tarjeta roja
										</IonSelectOption>
										<IonSelectOption value="Doble amariila">
											Doble amariila
										</IonSelectOption>
										<IonSelectOption value="Cambio">Cambio</IonSelectOption>
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Minuto</IonLabel>
									<IonInput
										value={minutoEvento}
										type="number"
										max={90}
										min={0}
										onIonChange={(e) => {
											setMinutoEvento(Number.parseInt(e.detail.value + ""));
										}}
									/>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Jugador</IonLabel>
									<IonSelect
										value={jugadorEvento?._id}
										onIonChange={(e) => {
											setJugadorEvento(
												jugadoresLocales.find(
													(jugador) => jugador._id === e.detail.value
												) as Jugador
											);
										}}
									>
										{alineacionLocal?.jugadoresTitulares.map((jugador) => {
											return (
												<IonSelectOption value={jugador._id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										{alineacionLocal?.jugadoresSuplentes.map((jugador) => {
											return (
												<IonSelectOption value={jugador._id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										{alineacionVisitante?.jugadoresTitulares.map((jugador) => {
											return (
												<IonSelectOption value={jugador._id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										<IonItemDivider />
										{alineacionVisitante?.jugadoresSuplentes.map((jugador) => {
											return (
												<IonSelectOption value={jugador._id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Jugador 2</IonLabel>
									<IonSelect
										value={jugadorEvento2?._id}
										onIonChange={(e) => {
											setJugadorEvento2(
												jugadoresLocales.find(
													(jugador) => jugador._id === e.detail.value
												) as Jugador
											);
										}}
									>
										{alineacionLocal?.jugadoresTitulares.map((jugador) => {
											return (
												<IonSelectOption value={jugador._id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										{alineacionLocal?.jugadoresSuplentes.map((jugador) => {
											return (
												<IonSelectOption value={jugador._id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										{alineacionVisitante?.jugadoresTitulares.map((jugador) => {
											return (
												<IonSelectOption value={jugador._id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										<IonItemDivider />
										{alineacionVisitante?.jugadoresSuplentes.map((jugador) => {
											return (
												<IonSelectOption value={jugador._id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
									</IonSelect>
								</IonItem>
							</IonContent>
						</IonModal>
					</IonRow>

					<IonItemDivider>Alineaciones</IonItemDivider>
					<IonRow>
						<IonCol>
							<PartidosLista
								partido={partidoSeleccionado}
								jugadores={jugadoresLocales}
								local={true}
								setCambiado={setCambiado}
								setAlinecion={setAlineacionLocal}
							/>
						</IonCol>
						<IonCol>
							<PartidosLista
								partido={partidoSeleccionado}
								jugadores={jugadoresVisitantes}
								local={false}
								setCambiado={setCambiado}
								setAlinecion={setAlineacionVisitante}
							/>
						</IonCol>
					</IonRow>
				</>
			) : (
				<></>
			)}
		</>
	);
}
