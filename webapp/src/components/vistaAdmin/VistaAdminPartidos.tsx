import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
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
	useIonToast,
} from "@ionic/react";
import {
	addCircleOutline,
	arrowForwardCircle,
	closeCircleOutline,
	swapHorizontal,
	trash,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import {
	getJugadoresAntiguos,
	getJugadoresPorEquipo,
} from "../../endpoints/jugadorEndpoints";
import {
	getPartidosByJornada,
	updatePartido,
} from "../../endpoints/partidosEndpoint";
import { comparePosiciones, getIconByTipoEvento } from "../../helpers/helpers";
import {
	getAlineacionesSofaScore,
	getEventosDeSofaScore,
} from "../../helpers/sofaScoreHelper";
import {
	Alineacion,
	EventoPartido,
	Jugador,
	Partido,
} from "../../shared/sharedTypes";

export function VistaAdminPartidos(props: any): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	const [eventosLoading, setEventosLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("Analizando el Big Data");

	const [jornada, setJornada] = useState<number>(1);
	const [partidos, setPartidos] = useState<Partido[]>([]);
	const [partido, setPartido] = useState<string>();
	const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido>();

	const jornadas = Array.from(Array(38).keys());

	const [jugadoresLocales, setJugadoresLocales] = useState<Jugador[]>([]);
	const [jugadoresVisitantes, setJugadoresVisitantes] = useState<Jugador[]>([]);

	const [cambiado, setCambiado] = useState<boolean>(false);
	const [resultadoLocal, setResultadoLocal] = useState<number>(0);
	const [resultadoVisitante, setResultadoVisitante] = useState<number>(0);
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

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const setAlineacionLocalForAll = (a: Alineacion) => {
		setVaciosLocal(Array.from(Array(11 - a.jugadoresTitulares.length)));
		setAlineacionLocal({
			jugadoresTitulares: a.jugadoresTitulares.sort((a, b) =>
				comparePosiciones(a.posicion, b.posicion)
			),
			jugadoresSuplentes: a.jugadoresSuplentes.sort((a, b) =>
				comparePosiciones(a.posicion, b.posicion)
			),
		});
		setAlineacionLocal(a);
	};

	const setAlineacionVisitanteForAll = (a: Alineacion) => {
		setVaciosVisitante(Array.from(Array(11 - a.jugadoresTitulares.length)));
		setAlineacionVisitante({
			jugadoresTitulares: a.jugadoresTitulares.sort((a, b) =>
				comparePosiciones(a.posicion, b.posicion)
			),
			jugadoresSuplentes: a.jugadoresSuplentes.sort((a, b) =>
				comparePosiciones(a.posicion, b.posicion)
			),
		});
		setAlineacionVisitante(a);
	};

	const getPartidosDeJornada = async (jornada: number) => {
		setLoading(true);
		setCambiado(false);
		setJornada(jornada);
		await getPartidosByJornada(jornada)
			.then((partidos) => {
				setPartidos(partidos);
			})
			.catch((err) => {
				crearToast(err.message, true, "danger");
			});
		await changeSelectedPartido(undefined);
	};

	const changeSelectedPartido = async (partido: string | undefined) => {
		setLoading(true);
		setPartido(partido);
		if (partido === undefined) setPartidoSeleccionado(undefined);
		else {
			const p = partidos.filter((p) => p.id === partido).at(0);
			if (p) {
				setPartidoSeleccionado(p);
				await getJugadoresPorEquipo(p.local.id)
					.then((jugadores) => setJugadoresLocales(jugadores))
					.catch((err) => {
						crearToast(err.message, true, "danger");
					});
				await getJugadoresPorEquipo(p.visitante.id)
					.then((jugadores) => setJugadoresVisitantes(jugadores))
					.catch((err) => {
						crearToast(err.message, true, "danger");
					});
				setAlineacionLocalForAll(p.alineacionLocal);
				setAlineacionVisitanteForAll(p.alineacionVisitante);

				setResultadoLocal(p.resultadoLocal);
				setResultadoVisitante(p.resultadoVisitante);
				setEstado(p.estado);
				setFecha(p.fecha);
				setLink(p.linkSofaScore);
				setEventosPartido(p.eventos);
			} else setPartidoSeleccionado(undefined);
		}
		setCambiado(false);
		setLoading(false);
	};

	const guardarPartido = async () => {
		setLoading(true);
		if (partidoSeleccionado) {
			partidoSeleccionado.resultadoLocal = resultadoLocal;
			partidoSeleccionado.resultadoVisitante = resultadoVisitante;
			if (alineacionLocal)
				partidoSeleccionado.alineacionLocal = alineacionLocal;
			if (alineacionVisitante)
				partidoSeleccionado.alineacionVisitante = alineacionVisitante;
			if (estado) partidoSeleccionado.estado = estado;
			if (fecha) partidoSeleccionado.fecha = fecha;
			if (link) partidoSeleccionado.linkSofaScore = link;
			if (eventosPartido) partidoSeleccionado.eventos = eventosPartido;

			await updatePartido(partidoSeleccionado)
				.then((p) => {
					setPartidoSeleccionado(p);
				})
				.catch((err) => {
					crearToast(err.message, true, "danger");
				});
			setPartidos(
				partidos.map((p) => {
					if (p.id === partidoSeleccionado.id) return partidoSeleccionado;
					else return p;
				})
			);
		}
		setCambiado(false);
		setLoading(false);
	};

	const añadirEventos = (eventos: EventoPartido[], sofaScore: boolean) => {
		if (sofaScore)
			setEventosPartido(eventos.sort((a, b) => a.minuto - b.minuto));
		else {
			const eventosp = eventosPartido.concat(eventos);
			setEventosPartido(eventosp.sort((a, b) => a.minuto - b.minuto));
		}
	};

	const callSofaScoreForEventos = async () => {
		setEventosPartido([]);
		await getEventosDeSofaScore(partidoSeleccionado as Partido)
			.then((eventos) => {
				añadirEventos(eventos, true);
			})
			.catch((err) => {
				crearToast(
					"No se pudieron obtener los eventos para el partido",
					true,
					"warning"
				);
			});

		setCambiado(true);
		setEventosLoading(false);
	};

	const borrarEvento = (evento: EventoPartido) => {
		setEventosPartido(
			eventosPartido.filter(
				(e) =>
					!(
						e.minuto === evento.minuto &&
						e.tipo === evento.tipo &&
						e.jugador === evento.jugador &&
						e.jugador2 === evento.jugador2
					)
			)
		);
		setCambiado(true);
	};

	const callSofaScoreForAlineaciones = async () => {
		await getAlineacionesSofaScore(partidoSeleccionado as Partido)
			.then((alineaciones) => {
				setAlineacionLocalForAll(alineaciones.alineacionLocal);
				setAlineacionVisitanteForAll(alineaciones.alineacionVisitante);
			})
			.catch((err) => {
				crearToast(
					"No se pudieron obtener las alineaciones para el partido",
					true,
					"warning"
				);
			});

		setCambiado(true);
		setEventosLoading(false);
	};

	useEffect(() => {
		getPartidosDeJornada(jornada).catch((err) => {
			crearToast(err.message, true, "danger");
		});
	}, []);

	const [showModalLocal, setShowModalLocal] = useState<boolean>(false);
	const modalLocal = useRef<HTMLIonModalElement>(null);

	const [vaciosLocal, setVaciosLocal] = useState<any>(Array.from(Array(0)));

	const [forTitularLocal, setForTitularLocal] = useState<boolean>(true);
	const [antiguosCogidosLocal, setAntiguosCogidosLocal] =
		useState<boolean>(false);

	const changeTitularesLocal = (newTitulares: Jugador[]) => {
		setAlineacionLocalForAll({
			jugadoresTitulares: newTitulares,
			jugadoresSuplentes: alineacionLocal?.jugadoresSuplentes as Jugador[],
		});
	};

	const changeSuplLocal = (newSupl: Jugador[]) => {
		setAlineacionLocalForAll({
			jugadoresTitulares: alineacionLocal?.jugadoresTitulares as Jugador[],
			jugadoresSuplentes: newSupl,
		});
	};

	const getJugadoresNiTitularesNiSuplLocal = () => {
		return jugadoresLocales.filter((t) => {
			return (
				!alineacionLocal?.jugadoresTitulares.map((j) => j.id).includes(t.id) &&
				!alineacionLocal?.jugadoresSuplentes.map((j) => j.id).includes(t.id)
			);
		});
	};

	const cogerAntiguosLocal = () => {
		if (!antiguosCogidosLocal) {
			getJugadoresAntiguos(
				partidoSeleccionado?.visitante.id as string,
				partidoSeleccionado?.jornada as number
			)
				.then((j) => {
					let aux = jugadoresLocales.concat(j);
					setJugadoresLocales([...aux]);
				})
				.catch((err) => {
					crearToast(err.message, true, "danger");
				});
			setAntiguosCogidosLocal(true);
		}
	};

	const [showModalVisitante, setShowModalVisitante] = useState<boolean>(false);
	const modalVisitante = useRef<HTMLIonModalElement>(null);

	const [vaciosVisitante, setVaciosVisitante] = useState<any>(
		Array.from(Array(0))
	);

	const [forTitularVisitante, setForTitularVisitante] = useState<boolean>(true);
	const [antiguosCogidosVisitante, setAntiguosCogidosVisitante] =
		useState<boolean>(false);

	const changeTitularesVisitante = (newTitulares: Jugador[]) => {
		setAlineacionVisitanteForAll({
			jugadoresTitulares: newTitulares,
			jugadoresSuplentes: alineacionVisitante?.jugadoresSuplentes as Jugador[],
		});
	};

	const changeSuplVisitante = (newSupl: Jugador[]) => {
		setAlineacionVisitanteForAll({
			jugadoresTitulares: alineacionVisitante?.jugadoresTitulares as Jugador[],
			jugadoresSuplentes: newSupl,
		});
	};

	const getJugadoresNiTitularesNiSuplVisitante = () => {
		return jugadoresVisitantes.filter((t) => {
			return (
				!alineacionVisitante?.jugadoresTitulares
					.map((j) => j.id)
					.includes(t.id) &&
				!alineacionVisitante?.jugadoresSuplentes.map((j) => j.id).includes(t.id)
			);
		});
	};

	const cogerAntiguosVisitante = () => {
		if (!antiguosCogidosVisitante) {
			getJugadoresAntiguos(
				partidoSeleccionado?.visitante.id as string,
				partidoSeleccionado?.jornada as number
			)
				.then((j) => {
					let aux = jugadoresVisitantes.concat(j);
					setJugadoresVisitantes([...aux]);
				})
				.catch((err) => {
					crearToast(err.message, true, "danger");
				});
			setAntiguosCogidosVisitante(true);
		}
	};

	return (
		<>
			<IonLoading isOpen={loading} message={message} />
			<IonLoading isOpen={eventosLoading} message={"Robando los datos"} />
			<IonGrid>
				<IonRow>
					<IonCol sizeSm="6" sizeXs="12">
						<IonRow>
							<IonCol size="6">
								<IonSelect
									value={jornada}
									onIonChange={async (e) => {
										setMessage("Analizando el Big Data");
										await getPartidosDeJornada(e.detail.value);
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
											value={partidoSeleccionado?.id}
											placeholder="Selecciona un partido"
											interface="action-sheet"
											onIonChange={async (e) => {
												setMessage("Buscando los resumenes");
												await changeSelectedPartido(e.detail.value);
											}}
										>
											{partidos.map((p) => (
												<IonSelectOption key={p.id} value={p.id}>
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
												onClick={async () => {
													setMessage("Volviendo a la realidad");
													await changeSelectedPartido(partido);
													setCambiado(false);
												}}
											>
												Reset
											</IonButton>
											<IonButton
												color="success"
												onClick={async () => {
													setMessage("Guardando los cambios");
													await guardarPartido();
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
						<IonItem key={"resultadoLocal"} lines="none">
							<IonCol size="7">
								<IonLabel>
									Resultado {partidoSeleccionado.local.nombre}
								</IonLabel>
							</IonCol>
							<IonCol size="2">
								<IonInput
									type="number"
									min={0}
									value={resultadoLocal}
									onIonChange={(e) => {
										setCambiado(true);
										setResultadoLocal(Number.parseInt(e.detail.value + ""));
									}}
								/>
							</IonCol>
						</IonItem>
						<IonItem key={"resultadoVisitante"} lines="none">
							<IonCol size="7">
								<IonLabel>
									Resultado {partidoSeleccionado.visitante.nombre}
								</IonLabel>
							</IonCol>
							<IonCol size="2">
								<IonInput
									type="number"
									min={0}
									value={resultadoVisitante}
									onIonChange={(e) => {
										setCambiado(true);
										setResultadoVisitante(Number.parseInt(e.detail.value + ""));
									}}
								/>
							</IonCol>
						</IonItem>
						<IonButton
							onClick={async () => {
								setEventosLoading(true);
								await callSofaScoreForEventos();
							}}
						>
							COGER EVENTOS DE SOFASCORE
						</IonButton>
					</IonRow>
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
								<IonLabel position="stacked">Fecha y hora</IonLabel>
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
									<IonItem>
										<IonLabel>
											{evento.minuto}
											{"' | "}
											{getIconByTipoEvento(evento.tipo)}
											{"  "}
											{evento.jugador !== undefined
												? evento.jugador.nombre
												: ""}
											{evento.jugador2 !== undefined ? (
												<>
													{" "}
													{evento.tipo === "Gol" ? (
														<IonIcon icon={arrowForwardCircle} />
													) : (
														<IonIcon icon={swapHorizontal} color="danger" />
													)}{" "}
													{evento.jugador2.nombre}
												</>
											) : (
												""
											)}
										</IonLabel>
										<IonButton
											fill="clear"
											onClick={() => {
												borrarEvento(evento);
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

												añadirEventos(
													[
														{
															tipo: tipoEvento + "",
															minuto: minutoEvento,
															jugador: jugadorEvento as Jugador,
															jugador2: jugadorEvento2,
														},
													],
													false
												);
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
										value={jugadorEvento?.id}
										onIonChange={(e) => {
											setJugadorEvento(
												jugadoresLocales.find(
													(jugador) => jugador.id === e.detail.value
												) as Jugador
											);
										}}
									>
										{alineacionLocal?.jugadoresTitulares.map((jugador) => {
											return (
												<IonSelectOption value={jugador.id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										{alineacionLocal?.jugadoresSuplentes.map((jugador) => {
											return (
												<IonSelectOption value={jugador.id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										{alineacionVisitante?.jugadoresTitulares.map((jugador) => {
											return (
												<IonSelectOption value={jugador.id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										<IonItemDivider />
										{alineacionVisitante?.jugadoresSuplentes.map((jugador) => {
											return (
												<IonSelectOption value={jugador.id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Jugador 2</IonLabel>
									<IonSelect
										value={jugadorEvento2?.id}
										onIonChange={(e) => {
											setJugadorEvento2(
												jugadoresLocales.find(
													(jugador) => jugador.id === e.detail.value
												) as Jugador
											);
										}}
									>
										{alineacionLocal?.jugadoresTitulares.map((jugador) => {
											return (
												<IonSelectOption value={jugador.id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										{alineacionLocal?.jugadoresSuplentes.map((jugador) => {
											return (
												<IonSelectOption value={jugador.id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										{alineacionVisitante?.jugadoresTitulares.map((jugador) => {
											return (
												<IonSelectOption value={jugador.id}>
													{jugador.nombre}
												</IonSelectOption>
											);
										})}
										<IonItemDivider />
										{alineacionVisitante?.jugadoresSuplentes.map((jugador) => {
											return (
												<IonSelectOption value={jugador.id}>
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
					<IonButton
						onClick={async () => {
							setEventosLoading(true);
							await callSofaScoreForAlineaciones();
						}}
					>
						COGER DE SOFASCORE
					</IonButton>
					<IonRow>
						<IonCol>
							<>
								<IonRow style={{ justifyContent: "center" }}>
									<IonLabel>{partidoSeleccionado.local.nombre}</IonLabel>
								</IonRow>
								{alineacionLocal?.jugadoresTitulares.map((jugador) => (
									<>
										<IonCard key={"local-titular-" + jugador.id}>
											<IonCardContent>
												<IonItem lines="none">
													<IonLabel>{jugador.nombre}</IonLabel>

													<IonIcon
														color={"danger"}
														size="large"
														icon={closeCircleOutline}
														onClick={() => {
															changeTitularesLocal(
																alineacionLocal.jugadoresTitulares.filter(
																	(j) => j.id !== jugador.id
																)
															);
															setCambiado(true);
														}}
													/>
												</IonItem>
											</IonCardContent>
										</IonCard>
									</>
								))}
								{vaciosLocal.map((p: any) => {
									return (
										<>
											<IonCard style={{ outline: "dashed" }}>
												<IonCardContent>
													<IonRow style={{ justifyContent: "center" }}>
														<IonItem lines="none">
															<IonIcon
																size="large"
																icon={addCircleOutline}
																onClick={() => {
																	setForTitularLocal(true);
																	setShowModalLocal(true);
																	cogerAntiguosLocal();
																	setCambiado(true);
																}}
															/>
														</IonItem>
													</IonRow>
												</IonCardContent>
											</IonCard>
										</>
									);
								})}

								<IonRow style={{ justifyContent: "center" }}>
									<IonLabel>
										Suplentes {partidoSeleccionado.local.nombre}
									</IonLabel>
								</IonRow>

								{alineacionLocal?.jugadoresSuplentes.map((jugador) => (
									<>
										<IonCard key={"local-titular-" + jugador.id}>
											<IonCardContent>
												<IonItem lines="none">
													<IonLabel>{jugador.nombre}</IonLabel>

													<IonIcon
														color={"danger"}
														size="large"
														icon={closeCircleOutline}
														onClick={() => {
															changeSuplLocal(
																alineacionLocal.jugadoresSuplentes.filter(
																	(j) => j.id !== jugador.id
																)
															);
															setCambiado(true);
														}}
													/>
												</IonItem>
											</IonCardContent>
										</IonCard>
									</>
								))}

								<IonCard style={{ outline: "dashed" }}>
									<IonCardContent>
										<IonRow style={{ justifyContent: "center" }}>
											<IonItem lines="none">
												<IonIcon
													size="large"
													icon={addCircleOutline}
													onClick={() => {
														setForTitularLocal(false);
														setShowModalLocal(true);
														cogerAntiguosLocal();
														setCambiado(true);
													}}
												/>
											</IonItem>
										</IonRow>
									</IonCardContent>
								</IonCard>

								<IonModal
									ref={modalLocal}
									isOpen={showModalLocal}
									onDidDismiss={() => {
										setShowModalLocal(false);
									}}
								>
									<IonHeader>
										<IonToolbar>
											<IonButtons slot="start">
												<IonButton
													onClick={() => {
														modalLocal.current?.dismiss();
													}}
												>
													Cancel
												</IonButton>
											</IonButtons>
											<IonTitle>
												<IonRow className="ion-justify-content-center">
													Jugadores {partidoSeleccionado.local.nombre}
												</IonRow>
											</IonTitle>
										</IonToolbar>
									</IonHeader>
									<IonContent>
										<>
											{OrdenarPorPosiciones(
												getJugadoresNiTitularesNiSuplLocal(),
												(jugador: Jugador) => {
													if (forTitularLocal) {
														const a =
															alineacionLocal?.jugadoresTitulares as Jugador[];
														a.push(jugador);
														changeTitularesLocal(a);
													} else {
														const a =
															alineacionLocal?.jugadoresSuplentes as Jugador[];
														a.push(jugador);
														changeSuplLocal(a);
													}
													setShowModalLocal(false);
												}
											)}
										</>
									</IonContent>
								</IonModal>
							</>
						</IonCol>

						<IonCol>
							<>
								<IonRow style={{ justifyContent: "center" }}>
									<IonLabel>{partidoSeleccionado.visitante.nombre}</IonLabel>
								</IonRow>
								{alineacionVisitante?.jugadoresTitulares.map((jugador) => (
									<>
										<IonCard key={"Visitante-titular-" + jugador.id}>
											<IonCardContent>
												<IonItem lines="none">
													<IonLabel>{jugador.nombre}</IonLabel>

													<IonIcon
														color={"danger"}
														size="large"
														icon={closeCircleOutline}
														onClick={() => {
															changeTitularesVisitante(
																alineacionVisitante.jugadoresTitulares.filter(
																	(j) => j.id !== jugador.id
																)
															);
															setCambiado(true);
														}}
													/>
												</IonItem>
											</IonCardContent>
										</IonCard>
									</>
								))}
								{vaciosVisitante.map((p: any) => {
									return (
										<>
											<IonCard style={{ outline: "dashed" }}>
												<IonCardContent>
													<IonRow style={{ justifyContent: "center" }}>
														<IonItem lines="none">
															<IonIcon
																size="large"
																icon={addCircleOutline}
																onClick={() => {
																	setForTitularVisitante(true);
																	setShowModalVisitante(true);
																	cogerAntiguosVisitante();
																	setCambiado(true);
																}}
															/>
														</IonItem>
													</IonRow>
												</IonCardContent>
											</IonCard>
										</>
									);
								})}

								<IonRow style={{ justifyContent: "center" }}>
									<IonLabel>
										Suplentes {partidoSeleccionado.visitante.nombre}
									</IonLabel>
								</IonRow>

								{alineacionVisitante?.jugadoresSuplentes.map((jugador) => (
									<>
										<IonCard key={"Visitante-titular-" + jugador.id}>
											<IonCardContent>
												<IonItem lines="none">
													<IonLabel>{jugador.nombre}</IonLabel>

													<IonIcon
														color={"danger"}
														size="large"
														icon={closeCircleOutline}
														onClick={() => {
															changeSuplVisitante(
																alineacionVisitante.jugadoresSuplentes.filter(
																	(j) => j.id !== jugador.id
																)
															);
															setCambiado(true);
														}}
													/>
												</IonItem>
											</IonCardContent>
										</IonCard>
									</>
								))}

								<IonCard style={{ outline: "dashed" }}>
									<IonCardContent>
										<IonRow style={{ justifyContent: "center" }}>
											<IonItem lines="none">
												<IonIcon
													size="large"
													icon={addCircleOutline}
													onClick={() => {
														setForTitularVisitante(false);
														setShowModalVisitante(true);
														cogerAntiguosVisitante();
														setCambiado(true);
													}}
												/>
											</IonItem>
										</IonRow>
									</IonCardContent>
								</IonCard>

								<IonModal
									ref={modalVisitante}
									isOpen={showModalVisitante}
									onDidDismiss={() => {
										setShowModalVisitante(false);
									}}
								>
									<IonHeader>
										<IonToolbar>
											<IonButtons slot="start">
												<IonButton
													onClick={() => {
														modalVisitante.current?.dismiss();
													}}
												>
													Cancel
												</IonButton>
											</IonButtons>
											<IonTitle>
												<IonRow className="ion-justify-content-center">
													Jugadores {partidoSeleccionado.visitante.nombre}
												</IonRow>
											</IonTitle>
										</IonToolbar>
									</IonHeader>
									<IonContent>
										<>
											{OrdenarPorPosiciones(
												getJugadoresNiTitularesNiSuplVisitante(),
												(jugador: Jugador) => {
													if (forTitularVisitante) {
														const a =
															alineacionVisitante?.jugadoresTitulares as Jugador[];
														a.push(jugador);
														changeTitularesVisitante(a);
													} else {
														const a =
															alineacionVisitante?.jugadoresSuplentes as Jugador[];
														a.push(jugador);
														changeSuplVisitante(a);
													}
													setShowModalVisitante(false);
												}
											)}
										</>
									</IonContent>
								</IonModal>
							</>
						</IonCol>
					</IonRow>
				</>
			) : (
				<></>
			)}
		</>
	);
}

export function OrdenarPorPosiciones(
	jugadores: Jugador[],
	cambiarJugador: (jugador: Jugador) => void
): JSX.Element {
	const porteros = jugadores.filter((j) => j.posicion === "Portero");
	const defensas = jugadores.filter((j) => j.posicion === "Defensa");
	const mediocentros = jugadores.filter((j) => j.posicion === "Mediocentro");
	const delanteros = jugadores.filter((j) => j.posicion === "Delantero");

	return (
		<>
			<IonItemDivider>Porteros</IonItemDivider>
			{porteros.map((j) => {
				return (
					<IonItem onClick={() => cambiarJugador(j)}>
						<IonLabel>{j.nombre}</IonLabel>
					</IonItem>
				);
			})}
			<IonItemDivider>Defensas</IonItemDivider>
			{defensas.map((j) => {
				return (
					<IonItem onClick={() => cambiarJugador(j)}>
						<IonLabel>{j.nombre}</IonLabel>
					</IonItem>
				);
			})}
			<IonItemDivider>Mediocentros</IonItemDivider>
			{mediocentros.map((j) => {
				return (
					<IonItem onClick={() => cambiarJugador(j)}>
						<IonLabel>{j.nombre}</IonLabel>
					</IonItem>
				);
			})}
			<IonItemDivider>Delanteros</IonItemDivider>
			{delanteros.map((j) => {
				return (
					<IonItem onClick={() => cambiarJugador(j)}>
						<IonLabel>{j.nombre}</IonLabel>
					</IonItem>
				);
			})}
		</>
	);
}
