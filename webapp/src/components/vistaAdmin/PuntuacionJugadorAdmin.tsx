import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonRow,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { useRef, useState } from "react";
import { Jugador, PuntuacionJugador } from "../../shared/sharedTypes";

type PuntuacionJugadorAdminProps = {
	jugador: Jugador;
	jornada: number;
	puntuacion: PuntuacionJugador;
	rival: string;
	setPuntuacionesCambiadas: (puntuacionesCambiadas: boolean) => void;
};

export function PuntuacionJugadorAdmin(
	props: PuntuacionJugadorAdminProps
): JSX.Element {
	const jornada = props.jornada;
	const j = props.jugador;

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
									<IonButton onClick={() => modal.current?.dismiss()}>
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
							{crearItem(
								j._id,
								"Goles",
								jornada,
								props.puntuacion.puntuacionBasica.goles.estadistica,
								(e) => {
									props.puntuacion.puntuacionBasica.goles.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Valoracion",
								jornada,
								props.puntuacion.puntuacionBasica.valoracion.estadistica,
								(e) => {
									props.puntuacion.puntuacionBasica.valoracion.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Minutos",
								jornada,
								props.puntuacion.puntuacionBasica.minutos.estadistica,
								(e) => {
									props.puntuacion.puntuacionBasica.minutos.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Asistencias",
								jornada,
								props.puntuacion.puntuacionBasica.asistencias.estadistica,
								(e) => {
									props.puntuacion.puntuacionBasica.asistencias.estadistica =
										parseInt(e.detail.value!);
								}
							)}

							{crearItem(
								j._id,
								"Tiros a puerta",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosPuerta.estadistica,
								(e) => {
									props.puntuacion.puntuacionOfensiva.tirosPuerta.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Tiros fuera",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosFuera.estadistica,
								(e) => {
									props.puntuacion.puntuacionOfensiva.tirosFuera.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Tiros rechazados",
								jornada,
								props.puntuacion.puntuacionOfensiva.tirosBloqueados.estadistica,
								(e) => {
									props.puntuacion.puntuacionOfensiva.tirosBloqueados.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Regates completados",
								jornada,
								props.puntuacion.puntuacionOfensiva.regatesCompletados
									.estadistica,
								(e) => {
									props.puntuacion.puntuacionOfensiva.regatesCompletados.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Ocasiones falladas",
								jornada,
								props.puntuacion.puntuacionOfensiva.ocasionClaraFallada
									.estadistica,
								(e) => {
									props.puntuacion.puntuacionOfensiva.ocasionClaraFallada.estadistica =
										parseInt(e.detail.value!);
								}
							)}

							{crearItem(
								j._id,
								"Pases clave",
								jornada,
								props.puntuacion.puntuacionPosesion.pasesClave.estadistica,
								(e) => {
									props.puntuacion.puntuacionPosesion.pasesClave.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Centros completados",
								jornada,
								props.puntuacion.puntuacionPosesion.centrosCompletados
									.estadistica,
								(e) => {
									props.puntuacion.puntuacionPosesion.centrosCompletados.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Grandes ocasiones creadas",
								jornada,
								props.puntuacion.puntuacionPosesion.grandesOcasiones
									.estadistica,
								(e) => {
									props.puntuacion.puntuacionPosesion.grandesOcasiones.estadistica =
										parseInt(e.detail.value!);
								}
							)}

							{crearItem(
								j._id,
								"Despejes",
								jornada,
								props.puntuacion.puntuacionDefensiva.despejes.estadistica,
								(e) => {
									props.puntuacion.puntuacionDefensiva.despejes.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Entradas",
								jornada,
								props.puntuacion.puntuacionDefensiva.entradas.estadistica,
								(e) => {
									props.puntuacion.puntuacionDefensiva.entradas.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Intercepciones",
								jornada,
								props.puntuacion.puntuacionDefensiva.intercepciones.estadistica,
								(e) => {
									props.puntuacion.puntuacionDefensiva.intercepciones.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Tiros bloqueados",
								jornada,
								props.puntuacion.puntuacionDefensiva.tirosBloqueados
									.estadistica,
								(e) => {
									props.puntuacion.puntuacionDefensiva.tirosBloqueados.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Errores para disparo",
								jornada,
								props.puntuacion.puntuacionDefensiva.erroresParaDisparo
									.estadistica,
								(e) => {
									props.puntuacion.puntuacionDefensiva.erroresParaDisparo.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Goles en propia",
								jornada,
								props.puntuacion.puntuacionDefensiva.golesEnPropia.estadistica,
								(e) => {
									props.puntuacion.puntuacionDefensiva.golesEnPropia.estadistica =
										parseInt(e.detail.value!);
								}
							)}

							{crearItem(
								j._id,
								"Faltas cometidas",
								jornada,
								props.puntuacion.puntuacionFisico.faltasCometidas.estadistica,
								(e) => {
									props.puntuacion.puntuacionFisico.faltasCometidas.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Faltas recibidas",
								jornada,
								props.puntuacion.puntuacionFisico.faltasRecibidas.estadistica,
								(e) => {
									props.puntuacion.puntuacionFisico.faltasRecibidas.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Duelos ganados",
								jornada,
								props.puntuacion.puntuacionFisico.duelosGanados.estadistica,
								(e) => {
									props.puntuacion.puntuacionFisico.duelosGanados.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Duelos perdidos",
								jornada,
								props.puntuacion.puntuacionFisico.duelosPerdidos.estadistica,
								(e) => {
									props.puntuacion.puntuacionFisico.duelosPerdidos.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Posesion perdida",
								jornada,
								props.puntuacion.puntuacionFisico.posesionPerdida.estadistica,
								(e) => {
									props.puntuacion.puntuacionFisico.posesionPerdida.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Fueras de juego",
								jornada,
								props.puntuacion.puntuacionFisico.fuerasDeJuego.estadistica,
								(e) => {
									props.puntuacion.puntuacionFisico.fuerasDeJuego.estadistica =
										parseInt(e.detail.value!);
								}
							)}

							{crearItem(
								j._id,
								"Paradas",
								jornada,
								props.puntuacion.puntuacionPortero.paradas.estadistica,
								(e) => {
									props.puntuacion.puntuacionPortero.paradas.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Despejes puños",
								jornada,
								props.puntuacion.puntuacionPortero.highClaim.estadistica,
								(e) => {
									props.puntuacion.puntuacionPortero.highClaim.estadistica =
										parseInt(e.detail.value!);
								}
							)}
							{crearItem(
								j._id,
								"Salidas",
								jornada,
								props.puntuacion.puntuacionPortero.salidas.estadistica,
								(e) => {
									props.puntuacion.puntuacionPortero.salidas.estadistica =
										parseInt(e.detail.value!);
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

export function crearItem(
	idJugador: string,
	label: string,
	semana: number,
	estadistica: number,
	funcion: (e: any) => void
) {
	return (
		<IonItem key={idJugador + "-" + label + "-" + semana} lines="none">
			<IonCol size="8">
				<IonLabel>{label}</IonLabel>
			</IonCol>
			<IonCol size="4">
				<IonInput value={estadistica ? estadistica : 0} onIonChange={funcion} />
			</IonCol>
		</IonItem>
	);
}
