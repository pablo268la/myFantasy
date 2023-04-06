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
} from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import {
	getPuntuacionJugadorSemana,
	guardarPuntuacionJugador,
} from "../../endpoints/puntuacionesController";
import {
	filterAndPop,
	filterAndPopByTramos,
	getByTramos,
	openJSON,
} from "../../helpers/jsonHelper";
import { getPuntuacionesDeSofaScore } from "../../helpers/sofaScoreHelper";
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
};

export function PuntuacionJugadorAdmin(
	props: PuntuacionJugadorAdminProps
): JSX.Element {
	const jornada = props.jornada;
	const j = props.jugador;
	const puntuacionJSON: PuntuacionJSON = openJSON(props.jugador.posicion);

	const [showModal, setShowModal] = useState<boolean>(false);
	const modal = useRef<HTMLIonModalElement>(null);

	const [puntuacion, setPuntuacion] = useState<PuntuacionJugador>();

	const [guardando, setGuardando] = useState<boolean>(false);

	useEffect(() => {
		if (props.guardarPuntuaciones) {
			setGuardando(true);
			guardarPuntuacionJugadorEnBD();
			
		} else {
			getPuntuacionDelJugador();
		}
	}, [props.guardarPuntuaciones]);

	const guardarPuntuacionJugadorEnBD = async () => {
		if (puntuacion !== undefined)
			await guardarPuntuacionJugador(puntuacion).then((p) => {
				setPuntuacion(p)
				setGuardando(false);
			});
	};

	const getPuntuacionDelJugador = async () => {
		await getPuntuacionJugadorSemana(props.jugador._id, props.jornada).then(
			async (p) => {
				if (p === null) {
					await getPuntuacionesDeSofaScore(
						props.partido,
						j,
						props.titular
					).then((ps) => {
						setPuntuacion(ps[0]);
					});
				} else {
					setPuntuacion(p);
				}
			}
		);
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
						}}
					>
						<IonHeader>
							<IonToolbar>
								<IonButtons slot="start">
									<IonButton
										onClick={async () => {
											await getPuntuacionDelJugador();
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
											props.setPuntuacionesCambiadas(true);
										}}
									>
										Confirm
									</IonButton>
								</IonButtons>
							</IonToolbar>
						</IonHeader>
						<IonContent>
							{CrearItem(
								j._id,
								"Valoracion",
								jornada,
								puntuacion.puntuacionBasica.valoracion,
								(e) => {
									puntuacion.puntuacionBasica.valoracion.estadistica =
										parseFloat(e.detail.value!);
									puntuacion.puntuacionBasica.valoracion.puntos = filterAndPop(
										puntuacionJSON.valoracion,
										e.detail.value
									);
								}
							)}
							{CrearItem(
								j._id,
								"Minutos",
								jornada,
								puntuacion.puntuacionBasica.minutos,
								(e) => {
									puntuacion.puntuacionBasica.minutos.estadistica = parseInt(
										e.detail.value!
									);
									puntuacion.puntuacionBasica.minutos.puntos = filterAndPop(
										puntuacionJSON.minutos,
										e.detail.value
									);
								}
							)}
							{CrearItem(
								j._id,
								"Goles",
								jornada,
								puntuacion.puntuacionBasica.goles,
								(e) => {
									puntuacion.puntuacionBasica.goles.estadistica = parseInt(
										e.detail.value!
									);
									puntuacion.puntuacionBasica.goles.puntos = getByTramos(
										puntuacionJSON.goles,
										parseInt(e.detail.value!)
									);
								}
							)}
							{CrearItem(
								j._id,
								"Asistencias",
								jornada,
								puntuacion.puntuacionBasica.asistencias,
								(e) => {
									puntuacion.puntuacionBasica.asistencias.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionBasica.asistencias.puntos = getByTramos(
										puntuacionJSON.asistencias,
										parseInt(e.detail.value!)
									);
								}
							)}

							{CrearItem(
								j._id,
								"Tiros a puerta",
								jornada,
								puntuacion.puntuacionOfensiva.tirosPuerta,
								(e) => {
									puntuacion.puntuacionOfensiva.tirosPuerta.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionOfensiva.tirosPuerta.puntos =
										getByTramos(puntuacionJSON.tirosPuerta, e.detail.value);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros fuera",
								jornada,
								puntuacion.puntuacionOfensiva.tirosFuera,
								(e) => {
									puntuacion.puntuacionOfensiva.tirosFuera.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionOfensiva.tirosFuera.puntos = getByTramos(
										puntuacionJSON.tirosFuera,
										e.detail.value
									);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros rechazados",
								jornada,
								puntuacion.puntuacionOfensiva.tirosBloqueados,
								(e) => {
									puntuacion.puntuacionOfensiva.tirosBloqueados.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionOfensiva.tirosBloqueados.puntos =
										getByTramos(puntuacionJSON.tirosBloqueados, e.detail.value);
								}
							)}
							{CrearItem(
								j._id,
								"Regates completados",
								jornada,
								puntuacion.puntuacionOfensiva.regatesCompletados,
								(e) => {
									puntuacion.puntuacionOfensiva.regatesCompletados.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionOfensiva.regatesCompletados.puntos =
										getByTramos(
											puntuacionJSON.regatesCompletados,
											e.detail.value
										);
								}
							)}
							{CrearItem(
								j._id,
								"Ocasiones falladas",
								jornada,
								puntuacion.puntuacionOfensiva.ocasionClaraFallada,
								(e) => {
									puntuacion.puntuacionOfensiva.ocasionClaraFallada.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionOfensiva.ocasionClaraFallada.puntos =
										getByTramos(
											puntuacionJSON.ocasionClaraFallada,
											e.detail.value
										);
								}
							)}

							{CrearItem(
								j._id,
								"Pases clave",
								jornada,
								puntuacion.puntuacionPosesion.pasesClave,
								(e) => {
									puntuacion.puntuacionPosesion.pasesClave.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionPosesion.pasesClave.puntos = getByTramos(
										puntuacionJSON.pasesClave,
										e.detail.value!
									);
								}
							)}
							{CrearItem(
								j._id,
								"Centros completados",
								jornada,
								puntuacion.puntuacionPosesion.centrosCompletados,
								(e) => {
									puntuacion.puntuacionPosesion.centrosCompletados.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionPosesion.centrosCompletados.puntos =
										getByTramos(
											puntuacionJSON.centrosCompletados,
											e.detail.value!
										);
								}
							)}
							{CrearItem(
								j._id,
								"Grandes ocasiones creadas",
								jornada,
								puntuacion.puntuacionPosesion.grandesOcasiones,
								(e) => {
									puntuacion.puntuacionPosesion.grandesOcasiones.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionPosesion.grandesOcasiones.puntos =
										getByTramos(
											puntuacionJSON.grandesOcasiones,
											e.detail.value!
										);
								}
							)}
							{CrearItem(
								j._id,
								"Goles recibidos",
								jornada,
								puntuacion.puntuacionCalculable.golesRecibidos,
								(e) => {
									puntuacion.puntuacionCalculable.golesRecibidos.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionCalculable.golesRecibidos.puntos =
										filterAndPopByTramos(
											puntuacionJSON.golesRecibidos,
											e.detail.value!
										);
								}
							)}

							{CrearItem(
								j._id,
								"Despejes",
								jornada,
								puntuacion.puntuacionDefensiva.despejes,
								(e) => {
									puntuacion.puntuacionDefensiva.despejes.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionDefensiva.despejes.puntos = getByTramos(
										puntuacionJSON.despejes,
										e.detail.value!
									);
								}
							)}
							{CrearItem(
								j._id,
								"Entradas",
								jornada,
								puntuacion.puntuacionDefensiva.entradas,
								(e) => {
									puntuacion.puntuacionDefensiva.entradas.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionDefensiva.entradas.puntos = getByTramos(
										puntuacionJSON.entradas,
										e.detail.value!
									);
								}
							)}
							{CrearItem(
								j._id,
								"Intercepciones",
								jornada,
								puntuacion.puntuacionDefensiva.intercepciones,
								(e) => {
									puntuacion.puntuacionDefensiva.intercepciones.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionDefensiva.intercepciones.puntos =
										getByTramos(puntuacionJSON.intercepciones, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros bloqueados",
								jornada,
								puntuacion.puntuacionDefensiva.tirosBloqueados,
								(e) => {
									puntuacion.puntuacionDefensiva.tirosBloqueados.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionDefensiva.tirosBloqueados.puntos =
										getByTramos(
											puntuacionJSON.tirosBloqueados,
											e.detail.value!
										);
								}
							)}
							{CrearItem(
								j._id,
								"Errores para disparo",
								jornada,
								puntuacion.puntuacionDefensiva.erroresParaDisparo,
								(e) => {
									puntuacion.puntuacionDefensiva.erroresParaDisparo.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionDefensiva.erroresParaDisparo.puntos =
										getByTramos(
											puntuacionJSON.erroresParaDisparo,
											e.detail.value!
										);
								}
							)}
							{CrearItem(
								j._id,
								"Goles en propia",
								jornada,
								puntuacion.puntuacionDefensiva.golesEnPropia,
								(e) => {
									puntuacion.puntuacionDefensiva.golesEnPropia.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionDefensiva.golesEnPropia.puntos =
										getByTramos(puntuacionJSON.golesEnPropia, e.detail.value!);
								}
							)}

							{CrearItem(
								j._id,
								"Faltas cometidas",
								jornada,
								puntuacion.puntuacionFisico.faltasCometidas,
								(e) => {
									puntuacion.puntuacionFisico.faltasCometidas.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionFisico.faltasCometidas.puntos =
										getByTramos(
											puntuacionJSON.faltasCometidas,
											e.detail.value!
										);
								}
							)}
							{CrearItem(
								j._id,
								"Faltas recibidas",
								jornada,
								puntuacion.puntuacionFisico.faltasRecibidas,
								(e) => {
									puntuacion.puntuacionFisico.faltasRecibidas.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionFisico.faltasRecibidas.puntos =
										getByTramos(
											puntuacionJSON.faltasRecibidas,
											e.detail.value!
										);
								}
							)}
							{CrearItem(
								j._id,
								"Duelos ganados",
								jornada,
								puntuacion.puntuacionFisico.duelosGanados,
								(e) => {
									puntuacion.puntuacionFisico.duelosGanados.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionFisico.duelosGanados.puntos =
										getByTramos(puntuacionJSON.duelosGanados, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Duelos perdidos",
								jornada,
								puntuacion.puntuacionFisico.duelosPerdidos,
								(e) => {
									puntuacion.puntuacionFisico.duelosPerdidos.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionFisico.duelosPerdidos.puntos =
										getByTramos(puntuacionJSON.duelosPerdidos, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Posesion perdida",
								jornada,
								puntuacion.puntuacionFisico.posesionPerdida,
								(e) => {
									puntuacion.puntuacionFisico.posesionPerdida.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionFisico.posesionPerdida.puntos =
										getByTramos(
											puntuacionJSON.posesionPerdida,
											e.detail.value!
										);
								}
							)}
							{CrearItem(
								j._id,
								"Fueras de juego",
								jornada,
								puntuacion.puntuacionFisico.fuerasDeJuego,
								(e) => {
									puntuacion.puntuacionFisico.fuerasDeJuego.estadistica =
										parseInt(e.detail.value!);
									puntuacion.puntuacionFisico.fuerasDeJuego.puntos =
										getByTramos(puntuacionJSON.fuerasDeJuego, e.detail.value!);
								}
							)}

							{CrearItem(
								j._id,
								"Paradas",
								jornada,
								puntuacion.puntuacionPortero.paradas,
								(e) => {
									puntuacion.puntuacionPortero.paradas.estadistica = parseInt(
										e.detail.value!
									);
									puntuacion.puntuacionPortero.paradas.puntos = getByTramos(
										puntuacionJSON.paradas,
										e.detail.value!
									);
								}
							)}
							{CrearItem(
								j._id,
								"Despejes puños",
								jornada,
								puntuacion.puntuacionPortero.highClaim,
								(e) => {
									puntuacion.puntuacionPortero.highClaim.estadistica = parseInt(
										e.detail.value!
									);
									puntuacion.puntuacionPortero.highClaim.puntos = getByTramos(
										puntuacionJSON.highClaim,
										e.detail.value!
									);
								}
							)}
							{CrearItem(
								j._id,
								"Salidas",
								jornada,
								puntuacion.puntuacionPortero.salidas,
								(e) => {
									puntuacion.puntuacionPortero.salidas.estadistica = parseInt(
										e.detail.value!
									);
									puntuacion.puntuacionPortero.salidas.puntos = getByTramos(
										puntuacionJSON.salidas,
										e.detail.value!
									);
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
	functionChangeValue: (e: any) => void
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
