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
	IonLabel,
	IonModal,
	IonRow,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import { useRef, useState } from "react";
import { filterAndPop, getByTramos, openJSON } from "../../helpers/jsonHelper";
import {
	Jugador,
	PuntuacionJSON,
	PuntuacionJugador,
} from "../../shared/sharedTypes";

type PuntuacionJugadorAdminProps = {
	jugador: Jugador;
	jornada: number;
	puntuacion: PuntuacionJugador;
	rival: string;
	setPuntuacionesCambiadas: (puntuacionesCambiadas: boolean) => void;
	addChangedPuntuacion: (puntuacion: PuntuacionJugador) => void;
	deleteChangedPuntuacion: (puntuacion: PuntuacionJugador) => void;
};

export function PuntuacionJugadorAdmin(
	props: PuntuacionJugadorAdminProps
): JSX.Element {
	const jornada = props.jornada;
	const j = props.jugador;
	const puntuacionJSON: PuntuacionJSON = openJSON();

	const [safePuntuacion, setSafePuntuacion] = useState<PuntuacionJugador>(
		props.puntuacion
	);

	const [showModal, setShowModal] = useState<boolean>(false);
	const modal = useRef<HTMLIonModalElement>(null);

	return (
		<>
			{props.puntuacion ? (
				<>
					<IonCard key={j._id}>
						<IonCardContent>
							<IonItem>
								<IonLabel> {j.nombre} </IonLabel>
								<IonLabel slot="end"> {props.puntuacion.puntos} </IonLabel>
								<IonButton
									slot="end"
									size="small"
									color="primary"
									fill="outline"
									onClick={() => {
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
										onClick={() => {
											modal.current?.dismiss();
											props.deleteChangedPuntuacion(props.puntuacion);
										}}
									>
										Cancel
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
								props.puntuacion.puntuacionBasica.valoracion.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionBasica.valoracion.estadistica =
										parseFloat(e.detail.value!);
								},
								(e: number) => {
									return filterAndPop(puntuacionJSON.valoracion, e);
								}
							)}
							{CrearItem(
								j._id,
								"Minutos",
								jornada,
								props.puntuacion.puntuacionBasica.minutos.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionBasica.minutos.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return filterAndPop(puntuacionJSON.minutos, e);
								}
							)}
							{CrearItem(
								j._id,
								"Goles",
								jornada,
								props.puntuacion.puntuacionBasica.goles.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionBasica.goles.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.goles, e);
								}
							)}
							{CrearItem(
								j._id,
								"Asistencias",
								jornada,
								props.puntuacion.puntuacionBasica.asistencias.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionBasica.asistencias.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.asistencias, e);
								}
							)}

							{CrearItem(
								j._id,
								"Tiros a puerta",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosPuerta.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.tirosPuerta.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.tirosPuerta, e);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros fuera",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosFuera.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.tirosFuera.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.tirosFuera, e);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros rechazados",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosBloqueados.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.tirosBloqueados.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.tirosBloqueados, e);
								}
							)}
							{CrearItem(
								j._id,
								"Regates completados",
								jornada,
								props.puntuacion.puntuacionOfensiva.regatesCompletados
									.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.regatesCompletados.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.regatesCompletados, e);
								}
							)}
							{CrearItem(
								j._id,
								"Ocasiones falladas",
								jornada,
								props.puntuacion.puntuacionOfensiva.ocasionClaraFallada
									.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.ocasionClaraFallada.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.ocasionClaraFallada, e);
								}
							)}

							{CrearItem(
								j._id,
								"Pases clave",
								jornada,
								props.puntuacion.puntuacionPosesion.pasesClave.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPosesion.pasesClave.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.pasesClave, e);
								}
							)}
							{CrearItem(
								j._id,
								"Centros completados",
								jornada,
								props.puntuacion.puntuacionPosesion.centrosCompletados
									.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPosesion.centrosCompletados.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.centrosCompletados, e);
								}
							)}
							{CrearItem(
								j._id,
								"Grandes ocasiones creadas",
								jornada,
								props.puntuacion.puntuacionPosesion.grandesOcasiones
									.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPosesion.grandesOcasiones.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.grandesOcasiones, e);
								}
							)}

							{CrearItem(
								j._id,
								"Despejes",
								jornada,
								props.puntuacion.puntuacionDefensiva.despejes.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.despejes.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.despejes, e);
								}
							)}
							{CrearItem(
								j._id,
								"Entradas",
								jornada,
								props.puntuacion.puntuacionDefensiva.entradas.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.entradas.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.entradas, e);
								}
							)}
							{CrearItem(
								j._id,
								"Intercepciones",
								jornada,
								props.puntuacion.puntuacionDefensiva.intercepciones.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.intercepciones.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.intercepciones, e);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros bloqueados",
								jornada,
								props.puntuacion.puntuacionDefensiva.tirosBloqueados
									.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.tirosBloqueados.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.tirosBloqueados, e);
								}
							)}
							{CrearItem(
								j._id,
								"Errores para disparo",
								jornada,
								props.puntuacion.puntuacionDefensiva.erroresParaDisparo
									.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.erroresParaDisparo.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.erroresParaDisparo, e);
								}
							)}
							{CrearItem(
								j._id,
								"Goles en propia",
								jornada,
								props.puntuacion.puntuacionDefensiva.golesEnPropia.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.golesEnPropia.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.golesEnPropia, e);
								}
							)}

							{CrearItem(
								j._id,
								"Faltas cometidas",
								jornada,
								props.puntuacion.puntuacionFisico.faltasCometidas.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.faltasCometidas.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.faltasCometidas, e);
								}
							)}
							{CrearItem(
								j._id,
								"Faltas recibidas",
								jornada,
								props.puntuacion.puntuacionFisico.faltasRecibidas.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.faltasRecibidas.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.faltasRecibidas, e);
								}
							)}
							{CrearItem(
								j._id,
								"Duelos ganados",
								jornada,
								props.puntuacion.puntuacionFisico.duelosGanados.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.duelosGanados.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.duelosGanados, e);
								}
							)}
							{CrearItem(
								j._id,
								"Duelos perdidos",
								jornada,
								props.puntuacion.puntuacionFisico.duelosPerdidos.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.duelosPerdidos.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.duelosPerdidos, e);
								}
							)}
							{CrearItem(
								j._id,
								"Posesion perdida",
								jornada,
								props.puntuacion.puntuacionFisico.posesionPerdida.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.posesionPerdida.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.posesionPerdida, e);
								}
							)}
							{CrearItem(
								j._id,
								"Fueras de juego",
								jornada,
								props.puntuacion.puntuacionFisico.fuerasDeJuego.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.fuerasDeJuego.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.fuerasDeJuego, e);
								}
							)}

							{CrearItem(
								j._id,
								"Paradas",
								jornada,
								props.puntuacion.puntuacionPortero.paradas.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPortero.paradas.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.paradas, e);
								}
							)}
							{CrearItem(
								j._id,
								"Despejes puños",
								jornada,
								props.puntuacion.puntuacionPortero.highClaim.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPortero.highClaim.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(puntuacionJSON.highClaim, e);
								}
							)}
							{CrearItem(
								j._id,
								"Salidas",
								jornada,
								props.puntuacion.puntuacionPortero.salidas.estadistica,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPortero.salidas.estadistica =
										parseInt(e.detail.value!);
								},
								(e: number) => {
									return getByTramos(
										puntuacionJSON.salidas,
										props.puntuacion.puntuacionPortero.salidas.estadistica
									);
								}
							)}
						</IonContent>
					</IonModal>
				</>
			) : (
				<></>
			)}
		</>
	);
}

export function CrearItem(
	idJugador: string,
	label: string,
	semana: number,
	estadistica: number,
	functionChangeValue: (e: any) => void,
	functionGetPuntos: (e: any) => number
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
					step={"any"}
					value={estadistica ? estadistica : 0}
					onIonChange={functionChangeValue}
				/>
			</IonCol>
			<IonCol size="1">
				<IonIcon icon={arrowForward} />
			</IonCol>
			<IonCol size="2">
				<IonInput
					style={{ color: "#aaaaaa" }}
					value={functionGetPuntos(estadistica)}
					readonly
				/>
			</IonCol>
		</IonItem>
	);
}
