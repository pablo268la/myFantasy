import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonModal,
	IonRow,
	IonTitle,
	IonToolbar,
	useIonToast,
} from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import {
	getPuntuacionJugadorSemana,
	guardarPuntuacionJugador,
} from "../../endpoints/puntuacionesEndpoint";
import {
	filterAndPop,
	filterAndPopByTramos,
	getByTramos,
	openJSON,
} from "../../helpers/jsonHelper";
import {
	calcularPuntosPuntuacion,
	getPuntuacionesDeSofaScore,
} from "../../helpers/sofaScoreHelper";
import {
	Jugador,
	Partido,
	PuntuacionJSON,
	PuntuacionJugador,
	PuntuacionTupple,
} from "../../shared/sharedTypes";

type PuntuacionJugadorAdminProps = {
	jugador: Jugador;
	jornada: number;
	rival: string;
	setPuntuacionesCambiadas: (puntuacionesCambiadas: boolean) => void;
	partido: Partido;
	titular: boolean;
	guardarPuntuaciones: boolean;
	somethingChanged: boolean;
};

export function VistaAdminPuntuacionJugador(
	props: PuntuacionJugadorAdminProps
): JSX.Element {
	const jornada = props.jornada;
	const j = props.jugador;
	const puntuacionJSON: PuntuacionJSON = openJSON(props.jugador.posicion);

	const [showModal, setShowModal] = useState<boolean>(false);
	const modal = useRef<HTMLIonModalElement>(null);

	const [puntuacion, setPuntuacion] = useState<PuntuacionJugador>();

	const [guardando, setGuardando] = useState<boolean>(false);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const actualizarPuntuacionYPuntos = (p: PuntuacionJugador) => {
		p.puntos = calcularPuntosPuntuacion(p);
		setPuntuacion(p);
		crearToast("Puntuación actualizada", true, "success");
	};

	useEffect(() => {
		if (props.guardarPuntuaciones) {
			setGuardando(true);
			guardarPuntuacionJugadorEnBD().catch((err) => {
				crearToast(err, true, "danger");
			});
		} else {
			getPuntuacionDelJugador().catch((err) => {
				crearToast(err, true, "danger");
			});
		}
	}, [props.somethingChanged]);

	const guardarPuntuacionJugadorEnBD = async () => {
		if (puntuacion !== undefined)
			await guardarPuntuacionJugador(puntuacion)
				.then((p) => {
					actualizarPuntuacionYPuntos(p);
					setGuardando(false);
				})
				.catch((err) => {
					crearToast(err, true, "danger");
				});
	};

	const getPuntuacionDelJugador = async () => {
		await getPuntuacionJugadorSemana(props.jugador._id, props.jornada)
			.then(async (p) => {
				if (p === null) {
					await getPuntuacionesDeSofaScore(props.partido, j, props.titular)
						.then((ps) => {
							actualizarPuntuacionYPuntos(ps[0]);
						})
						.catch((err) => {
							crearToast(err, true, "danger");
						});
				} else {
					actualizarPuntuacionYPuntos(p);
				}
			})
			.catch((err) => {
				crearToast(err, true, "danger");
			});
	};

	return (
		<>
			{puntuacion && !guardando ? (
				<>
					<IonCard key={j._id}>
						<IonCardContent>
							<IonItem>
								<IonLabel> {j.nombre} </IonLabel>
								<IonLabel slot="end"> {puntuacion.puntos} </IonLabel>
								<IonButton
									slot="end"
									size="small"
									color="primary"
									fill="outline"
									onClick={async () => {
										setShowModal(true);
									}}
								>
									Puntuación
								</IonButton>
							</IonItem>
						</IonCardContent>
					</IonCard>
					<IonModal
						ref={modal}
						trigger="open-modal"
						isOpen={showModal}
						onDidDismiss={() => {
							setShowModal(false);
							props.setPuntuacionesCambiadas(true);
						}}
					>
						<IonHeader>
							<IonToolbar>
								<IonButtons slot="start">
									<IonButton
										onClick={async () => {
											await getPuntuacionesDeSofaScore(
												props.partido,
												j,
												props.titular
											).then((ps) => {
												actualizarPuntuacionYPuntos(ps[0]);
											});
										}}
									>
										SofaScore
									</IonButton>
								</IonButtons>
								<IonTitle>
									<IonRow className="ion-justify-content-center">
										{j.nombre} vs {props.rival}
									</IonRow>
								</IonTitle>
								<IonButtons slot="end">
									<IonButton
										strong={true}
										onClick={() => {
											modal.current?.dismiss();
										}}
									>
										Confirm
									</IonButton>
								</IonButtons>
							</IonToolbar>
						</IonHeader>
						<IonContent>
							<IonItemDivider>Basicas</IonItemDivider>
							{CrearItem(
								j._id,
								"Valoracion",
								jornada,
								puntuacion.puntuacionBasica.valoracion,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionBasica: {
											...puntuacion.puntuacionBasica,
											valoracion: {
												estadistica: parseFloat(e.detail.value!),
												puntos: filterAndPop(
													puntuacionJSON.valoracion,
													e.detail.value
												),
											},
										},
									});
								},
								10.0
							)}
							{CrearItem(
								j._id,
								"Minutos",
								jornada,
								puntuacion.puntuacionBasica.minutos,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionBasica: {
											...puntuacion.puntuacionBasica,
											minutos: {
												estadistica: parseInt(e.detail.value!),
												puntos: filterAndPop(
													puntuacionJSON.minutos,
													e.detail.value
												),
											},
										},
									});
								},
								90
							)}
							{CrearItem(
								j._id,
								"Goles",
								jornada,
								puntuacion.puntuacionBasica.goles,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionBasica: {
											...puntuacion.puntuacionBasica,
											goles: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.goles,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Asistencias",
								jornada,
								puntuacion.puntuacionBasica.asistencias,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionBasica: {
											...puntuacion.puntuacionBasica,
											asistencias: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.asistencias,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Goles recibidos",
								jornada,
								puntuacion.puntuacionCalculable.golesRecibidos,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionCalculable: {
											...puntuacion.puntuacionCalculable,
											golesRecibidos: {
												estadistica: parseInt(e.detail.value!),
												puntos: filterAndPopByTramos(
													puntuacionJSON.golesRecibidos,
													e.detail.value,
													puntuacion.puntuacionBasica.minutos.estadistica
												),
											},
										},
									});
								},
								1
							)}
							{CrearItem(
								j._id,
								"Tarjeta amarilla",
								jornada,
								puntuacion.puntuacionCalculable.tarjetasAmarilla,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionCalculable: {
											...puntuacion.puntuacionCalculable,
											tarjetasAmarilla: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.tarjetasAmarilla,
													e.detail.value
												),
											},
										},
									});
								},
								1
							)}
							{CrearItem(
								j._id,
								"Tarjeta roja",
								jornada,
								puntuacion.puntuacionCalculable.tarjetasRoja,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionCalculable: {
											...puntuacion.puntuacionCalculable,
											tarjetasRoja: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.tarjetasRoja,
													e.detail.value
												),
											},
										},
									});
								},
								1
							)}
							{CrearItem(
								j._id,
								"Doble amarilla",
								jornada,
								puntuacion.puntuacionCalculable.dobleAmarilla,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionCalculable: {
											...puntuacion.puntuacionCalculable,
											dobleAmarilla: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.dobleAmarilla,
													e.detail.value
												),
											},
										},
									});
								},
								1
							)}
							<IonItemDivider>Ofensivas</IonItemDivider>
							{CrearItem(
								j._id,
								"Tiros a puerta",
								jornada,
								puntuacion.puntuacionOfensiva.tirosPuerta,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											tirosPuerta: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.tirosPuerta,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Tiros fuera",
								jornada,
								puntuacion.puntuacionOfensiva.tirosFuera,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											tirosFuera: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.tirosFuera,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Tiros rechazados",
								jornada,
								puntuacion.puntuacionOfensiva.tirosBloqueados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											tirosBloqueados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.tirosBloqueadosAtaque,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Tiros al palo",
								jornada,
								puntuacion.puntuacionOfensiva.tirosAlPalo,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											tirosAlPalo: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.tirosAlPalo,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Regates intentados",
								jornada,
								puntuacion.puntuacionOfensiva.regatesIntentados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											regatesIntentados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.regatesIntentados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Regates completados",
								jornada,
								puntuacion.puntuacionOfensiva.regatesCompletados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											regatesCompletados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.regatesCompletados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Ocasiones falladas",
								jornada,
								puntuacion.puntuacionOfensiva.ocasionClaraFallada,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											ocasionClaraFallada: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.ocasionClaraFallada,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Penalti provocado",
								jornada,
								puntuacion.puntuacionOfensiva.penaltiRecibido,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											penaltiRecibido: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.penaltiRecibido,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Penalti fallado",
								jornada,
								puntuacion.puntuacionOfensiva.penaltiFallado,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionOfensiva: {
											...puntuacion.puntuacionOfensiva,
											penaltiFallado: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.penaltiFallado,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							<IonItemDivider>Posesivas</IonItemDivider>
							{CrearItem(
								j._id,
								"Toques de balon",
								jornada,
								puntuacion.puntuacionPosesion.toquesBalon,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPosesion: {
											...puntuacion.puntuacionPosesion,
											toquesBalon: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.toquesBalon,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Pases clave",
								jornada,
								puntuacion.puntuacionPosesion.pasesClave,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPosesion: {
											...puntuacion.puntuacionPosesion,
											pasesClave: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.pasesClave,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Pases completados",
								jornada,
								puntuacion.puntuacionPosesion.pasesCompletados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPosesion: {
											...puntuacion.puntuacionPosesion,
											pasesCompletados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.pasesCompletados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Centros completados",
								jornada,
								puntuacion.puntuacionPosesion.centrosCompletados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPosesion: {
											...puntuacion.puntuacionPosesion,
											centrosCompletados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.centrosCompletados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Pases largos completados",
								jornada,
								puntuacion.puntuacionPosesion.pasesLargosCompletados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPosesion: {
											...puntuacion.puntuacionPosesion,
											pasesLargosCompletados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.pasesLargosCompletados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Grandes ocasiones creadas",
								jornada,
								puntuacion.puntuacionPosesion.grandesOcasiones,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPosesion: {
											...puntuacion.puntuacionPosesion,
											grandesOcasiones: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.grandesOcasiones,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							<IonItemDivider>Defensivas</IonItemDivider>
							{CrearItem(
								j._id,
								"Despejes",
								jornada,
								puntuacion.puntuacionDefensiva.despejes,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											despejes: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.despejes,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Despejes sobre la linea",
								jornada,
								puntuacion.puntuacionDefensiva.despejesEnLineaDeGol,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											despejesEnLineaDeGol: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.despejesEnLineaDeGol,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Entradas",
								jornada,
								puntuacion.puntuacionDefensiva.entradas,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											entradas: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.entradas,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Intercepciones",
								jornada,
								puntuacion.puntuacionDefensiva.intercepciones,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											intercepciones: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.intercepciones,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Tiros bloqueados",
								jornada,
								puntuacion.puntuacionDefensiva.tirosBloqueados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											tirosBloqueados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.tirosBloqueados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Errores para disparo",
								jornada,
								puntuacion.puntuacionDefensiva.erroresParaDisparo,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											entradas: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.erroresParaDisparo,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Goles en propia",
								jornada,
								puntuacion.puntuacionDefensiva.golesEnPropia,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											golesEnPropia: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.golesEnPropia,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Penalti cometido",
								jornada,
								puntuacion.puntuacionDefensiva.penaltiCometido,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											penaltiCometido: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.penaltiCometido,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Regateado",
								jornada,
								puntuacion.puntuacionDefensiva.regatesSuperado,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionDefensiva: {
											...puntuacion.puntuacionDefensiva,
											regatesSuperado: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.regatesSuperado,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							<IonItemDivider>Fisicas</IonItemDivider>
							{CrearItem(
								j._id,
								"Faltas cometidas",
								jornada,
								puntuacion.puntuacionFisico.faltasCometidas,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionFisico: {
											...puntuacion.puntuacionFisico,
											faltasCometidas: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.faltasCometidas,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Faltas recibidas",
								jornada,
								puntuacion.puntuacionFisico.faltasRecibidas,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionFisico: {
											...puntuacion.puntuacionFisico,
											faltasRecibidas: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.faltasRecibidas,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Duelos ganados",
								jornada,
								puntuacion.puntuacionFisico.duelosGanados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionFisico: {
											...puntuacion.puntuacionFisico,
											duelosGanados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.duelosGanados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Duelos perdidos",
								jornada,
								puntuacion.puntuacionFisico.duelosPerdidos,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionFisico: {
											...puntuacion.puntuacionFisico,
											duelosPerdidos: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.duelosPerdidos,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Duelos aereos ganados",
								jornada,
								puntuacion.puntuacionFisico.duelosAereosGanados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionFisico: {
											...puntuacion.puntuacionFisico,
											duelosAereosGanados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.duelosAereosGanados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Duelos aereos perdidos",
								jornada,
								puntuacion.puntuacionFisico.duelosAereosPerdidos,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionFisico: {
											...puntuacion.puntuacionFisico,
											duelosAereosPerdidos: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.duelosAereosPerdidos,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Posesion perdida",
								jornada,
								puntuacion.puntuacionFisico.posesionPerdida,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionFisico: {
											...puntuacion.puntuacionFisico,
											posesionPerdida: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.posesionPerdida,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Fueras de juego",
								jornada,
								puntuacion.puntuacionFisico.fuerasDeJuego,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionFisico: {
											...puntuacion.puntuacionFisico,
											fuerasDeJuego: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.faltasRecibidas,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							<IonItemDivider>Portero</IonItemDivider>
							{CrearItem(
								j._id,
								"Paradas",
								jornada,
								puntuacion.puntuacionPortero.paradas,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPortero: {
											...puntuacion.puntuacionPortero,
											paradas: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.paradas,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Salidas",
								jornada,
								puntuacion.puntuacionPortero.salidas,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPortero: {
											...puntuacion.puntuacionPortero,
											salidas: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.salidas,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Salidas en alto",
								jornada,
								puntuacion.puntuacionPortero.highClaim,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPortero: {
											...puntuacion.puntuacionPortero,
											highClaim: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.highClaim,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Despejes ",
								jornada,
								puntuacion.puntuacionPortero.despejes,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPortero: {
											...puntuacion.puntuacionPortero,
											despejes: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.despejesPortero,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							{CrearItem(
								j._id,
								"Penaltis parados",
								jornada,
								puntuacion.puntuacionPortero.penaltiesParados,
								(e) => {
									actualizarPuntuacionYPuntos({
										...puntuacion,
										puntuacionPortero: {
											...puntuacion.puntuacionPortero,
											penaltiesParados: {
												estadistica: parseInt(e.detail.value!),
												puntos: getByTramos(
													puntuacionJSON.penaltiesParados,
													e.detail.value
												),
											},
										},
									});
								}
							)}
							<IonItemDivider />
							<IonItem key={j._id + "- Total -" + jornada} lines="none">
								<IonCol size="7">
									<IonLabel>Total</IonLabel>
								</IonCol>
								<IonCol slot="end" size="2">
									<IonInput
										style={{ color: "#aaaaaa" }}
										value={puntuacion.puntos}
										readonly
									/>
								</IonCol>
							</IonItem>
						</IonContent>
					</IonModal>
				</>
			) : (
				<>
					<IonCard key={j._id}>
						<IonCardContent>
							<IonItem>
								<IonLabel> {j.nombre} </IonLabel>
								<IonLabel slot="end"> - </IonLabel>
								<IonButton
									slot="end"
									size="small"
									color="primary"
									fill="outline"
									disabled
								>
									Puntuación
								</IonButton>
							</IonItem>
						</IonCardContent>
					</IonCard>
				</>
			)}
		</>
	);
}

export function CrearItem(
	idJugador: string,
	label: string,
	semana: number,
	tupple: PuntuacionTupple,
	functionChangeValue: (e: any) => void,
	limit?: number
): JSX.Element {
	return (
		<IonItem key={idJugador + "-" + label + "-" + semana} lines="none">
			<IonCol size="7">
				<IonLabel>{label}</IonLabel>
			</IonCol>
			<IonCol size="2">
				<IonInput
					type="number"
					min={0}
					max={limit}
					step={label === "Valoracion" ? "0.1" : "any"}
					value={tupple.estadistica ? tupple.estadistica : 0}
					onIonChange={functionChangeValue}
				/>
			</IonCol>
			<IonCol size="1">
				<IonIcon icon={arrowForward} />
			</IonCol>
			<IonCol size="2">
				<IonInput style={{ color: "#aaaaaa" }} value={tupple.puntos} readonly />
			</IonCol>
		</IonItem>
	);
}
