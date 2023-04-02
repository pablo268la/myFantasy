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
	filterAndPop,
	filterAndPopByTramos,
	getByTramos,
	openJSON,
} from "../../helpers/jsonHelper";
import {
	Jugador,
	PuntuacionJSON,
	PuntuacionJugador,
	PuntuacionTupple,
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
	const puntuacionJSON: PuntuacionJSON = openJSON(props.jugador.posicion);

	const [showModal, setShowModal] = useState<boolean>(false);
	const modal = useRef<HTMLIonModalElement>(null);

	useEffect(() => {}, [props.puntuacion]);

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
								props.puntuacion.puntuacionBasica.valoracion,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionBasica.valoracion.estadistica =
										parseFloat(e.detail.value!);
									props.puntuacion.puntuacionBasica.valoracion.puntos =
										filterAndPop(puntuacionJSON.valoracion, e.detail.value);
								}
							)}
							{CrearItem(
								j._id,
								"Minutos",
								jornada,
								props.puntuacion.puntuacionBasica.minutos,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionBasica.minutos.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionBasica.minutos.puntos =
										filterAndPop(puntuacionJSON.minutos, e.detail.value);
								}
							)}
							{CrearItem(
								j._id,
								"Goles",
								jornada,
								props.puntuacion.puntuacionBasica.goles,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionBasica.goles.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionBasica.goles.puntos = getByTramos(
										puntuacionJSON.goles,
										parseInt(e.detail.value!)
									);
								}
							)}
							{CrearItem(
								j._id,
								"Asistencias",
								jornada,
								props.puntuacion.puntuacionBasica.asistencias,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionBasica.asistencias.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionBasica.asistencias.puntos =
										getByTramos(
											puntuacionJSON.asistencias,
											parseInt(e.detail.value!)
										);
								}
							)}

							{CrearItem(
								j._id,
								"Tiros a puerta",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosPuerta,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.tirosPuerta.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionOfensiva.tirosPuerta.puntos =
										getByTramos(puntuacionJSON.tirosPuerta, e.detail.value);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros fuera",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosFuera,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.tirosFuera.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionOfensiva.tirosFuera.puntos =
										getByTramos(puntuacionJSON.tirosFuera, e.detail.value);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros rechazados",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosBloqueados,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.tirosBloqueados.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionOfensiva.tirosBloqueados.puntos =
										getByTramos(puntuacionJSON.tirosBloqueados, e.detail.value);
								}
							)}
							{CrearItem(
								j._id,
								"Regates completados",
								jornada,
								props.puntuacion.puntuacionOfensiva.regatesCompletados,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.regatesCompletados.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionOfensiva.regatesCompletados.puntos =
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
								props.puntuacion.puntuacionOfensiva.ocasionClaraFallada,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionOfensiva.ocasionClaraFallada.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionOfensiva.ocasionClaraFallada.puntos =
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
								props.puntuacion.puntuacionPosesion.pasesClave,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPosesion.pasesClave.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionPosesion.pasesClave.puntos =
										getByTramos(puntuacionJSON.pasesClave, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Centros completados",
								jornada,
								props.puntuacion.puntuacionPosesion.centrosCompletados,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPosesion.centrosCompletados.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionPosesion.centrosCompletados.puntos =
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
								props.puntuacion.puntuacionPosesion.grandesOcasiones,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPosesion.grandesOcasiones.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionPosesion.grandesOcasiones.puntos =
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
								props.puntuacion.puntuacionCalculable.golesRecibidos,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionCalculable.golesRecibidos.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionCalculable.golesRecibidos.puntos =
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
								props.puntuacion.puntuacionDefensiva.despejes,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.despejes.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionDefensiva.despejes.puntos =
										getByTramos(puntuacionJSON.despejes, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Entradas",
								jornada,
								props.puntuacion.puntuacionDefensiva.entradas,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.entradas.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionDefensiva.entradas.puntos =
										getByTramos(puntuacionJSON.entradas, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Intercepciones",
								jornada,
								props.puntuacion.puntuacionDefensiva.intercepciones,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.intercepciones.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionDefensiva.intercepciones.puntos =
										getByTramos(puntuacionJSON.intercepciones, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Tiros bloqueados",
								jornada,
								props.puntuacion.puntuacionDefensiva.tirosBloqueados,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.tirosBloqueados.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionDefensiva.tirosBloqueados.puntos =
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
								props.puntuacion.puntuacionDefensiva.erroresParaDisparo,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.erroresParaDisparo.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionDefensiva.erroresParaDisparo.puntos =
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
								props.puntuacion.puntuacionDefensiva.golesEnPropia,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionDefensiva.golesEnPropia.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionDefensiva.golesEnPropia.puntos =
										getByTramos(puntuacionJSON.golesEnPropia, e.detail.value!);
								}
							)}

							{CrearItem(
								j._id,
								"Faltas cometidas",
								jornada,
								props.puntuacion.puntuacionFisico.faltasCometidas,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.faltasCometidas.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionFisico.faltasCometidas.puntos =
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
								props.puntuacion.puntuacionFisico.faltasRecibidas,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.faltasRecibidas.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionFisico.faltasRecibidas.puntos =
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
								props.puntuacion.puntuacionFisico.duelosGanados,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.duelosGanados.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionFisico.duelosGanados.puntos =
										getByTramos(puntuacionJSON.duelosGanados, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Duelos perdidos",
								jornada,
								props.puntuacion.puntuacionFisico.duelosPerdidos,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.duelosPerdidos.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionFisico.duelosPerdidos.puntos =
										getByTramos(puntuacionJSON.duelosPerdidos, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Posesion perdida",
								jornada,
								props.puntuacion.puntuacionFisico.posesionPerdida,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.posesionPerdida.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionFisico.posesionPerdida.puntos =
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
								props.puntuacion.puntuacionFisico.fuerasDeJuego,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionFisico.fuerasDeJuego.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionFisico.fuerasDeJuego.puntos =
										getByTramos(puntuacionJSON.fuerasDeJuego, e.detail.value!);
								}
							)}

							{CrearItem(
								j._id,
								"Paradas",
								jornada,
								props.puntuacion.puntuacionPortero.paradas,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPortero.paradas.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionPortero.paradas.puntos =
										getByTramos(puntuacionJSON.paradas, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Despejes puños",
								jornada,
								props.puntuacion.puntuacionPortero.highClaim,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPortero.highClaim.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionPortero.highClaim.puntos =
										getByTramos(puntuacionJSON.highClaim, e.detail.value!);
								}
							)}
							{CrearItem(
								j._id,
								"Salidas",
								jornada,
								props.puntuacion.puntuacionPortero.salidas,
								(e) => {
									props.addChangedPuntuacion(props.puntuacion);
									props.puntuacion.puntuacionPortero.salidas.estadistica =
										parseInt(e.detail.value!);
									props.puntuacion.puntuacionPortero.salidas.puntos =
										getByTramos(puntuacionJSON.salidas, e.detail.value!);
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
										value={props.puntuacion.puntos}
										readonly
									/>
								</IonCol>
							</IonItem>
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
					step={"any"}
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
