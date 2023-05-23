import {
    IonActionSheet,
    IonButton,
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPopover,
    IonRow,
    useIonToast,
} from "@ionic/react";
import { ellipsisVertical, share, trash, trophySharp } from "ionicons/icons";
import { useState } from "react";
import { deleteUsuarioFromLiga } from "../../endpoints/ligasEndpoints";
import {
    getUsuarioLogueado,
    ponerPuntosAValor,
    setLocalLigaSeleccionada,
    urlBackground2,
} from "../../helpers/helpers";
import { Liga } from "../../shared/sharedTypes";

type CartaLigaProps = {
	liga: Liga;
	disabled: boolean;
	cogerLigasUsuario: () => void;
	setMessage: (mensaje: string) => void;
	setShowLoading: (showLoading: boolean) => void;
};

export function CartaLiga(props: CartaLigaProps): JSX.Element {
	const [showActionSheet, setShowActionSheet] = useState(false);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const [showPopover, setShowPopover] = useState(false);

	const [liga, setLiga] = useState<Liga>(props.liga);
	const usuario = getUsuarioLogueado();

	return (
		<>
			<IonCard>
				<IonCardContent
					style={{
						background: urlBackground2,
					}}
				>
					<IonGrid>
						<IonRow>
							<IonCol
								onClick={() => {
									setLocalLigaSeleccionada(liga.id as string);
									window.location.href = "/clasificacion";
								}}
								style={{ justifyContent: "space-around" }}
							>
								<IonRow style={{ justifyContent: "center" }}>
									<IonLabel style={{ fontSize: "20px" }} color={"light"}>
										{liga.nombre}
									</IonLabel>
								</IonRow>
								<IonRow>
									<IonCol>
										<IonIcon
											size="large"
											icon={trophySharp}
											color="light"
										></IonIcon>
									</IonCol>
								</IonRow>
								<br />
								<IonRow style={{ justifyContent: "space-around" }}>
									<IonLabel color={"light"}>
										{
											liga.plantillasUsuarios
												.filter(
													(plantilla) => plantilla.usuario.id === usuario?.id
												)
												.at(0)?.puntos
										}{" "}
										pts
									</IonLabel>
									<IonLabel color={"light"}>
										{ponerPuntosAValor(
											liga.plantillasUsuarios
												.filter(
													(plantilla) => plantilla.usuario.id === usuario?.id
												)
												.at(0)?.dinero || 0
										)}
									</IonLabel>
									<IonLabel color={"light"}>
										{liga.plantillasUsuarios
											.map((plantilla) => {
												return {
													puntos: plantilla.puntos,
													usuario: plantilla.usuario,
												};
											})
											.sort((a, b) => b.puntos - a.puntos)
											.findIndex((pe) => pe.usuario.id === usuario?.id) + 1}
										/{liga.plantillasUsuarios.length}
									</IonLabel>
								</IonRow>
							</IonCol>
							<IonCol size="1">
								<IonButton
									fill="clear"
									onClick={() => setShowActionSheet(true)}
								>
									<IonIcon icon={ellipsisVertical} color="light"></IonIcon>
								</IonButton>
							</IonCol>
						</IonRow>
					</IonGrid>

					<IonActionSheet
						isOpen={showActionSheet}
						onDidDismiss={() => setShowActionSheet(false)}
						buttons={[
							{
								text: "Abandonar",
								role: "destructive",
								icon: trash,
								id: "delete-button",
								data: {
									type: "delete",
								},
								handler: async () => {
									props.setMessage("Abandonando liga...");
									props.setShowLoading(true);
									await deleteUsuarioFromLiga(
										liga.id as string,
										usuario?.id as string
									)
										.then(() => {
											crearToast("Has abandonado la liga", true, "success");
											props.setShowLoading(false);
											props.cogerLigasUsuario();
											setLocalLigaSeleccionada("NoLiga");
										})
										.catch((err) => {
											props.setShowLoading(false);
											crearToast(err.message, true, "danger");
										});
								},
							},
							{
								text: "Compartir",
								icon: share,
								handler: () => {
									setShowPopover(true);
								},
							},
						]}
					></IonActionSheet>
					<IonPopover
						isOpen={showPopover}
						onDidDismiss={() => setShowPopover(false)}
					>
						<IonContent>
							<IonItem fill="outline">
								<IonInput
									value={props.liga.enlaceInvitacion}
									readonly={true}
								></IonInput>
							</IonItem>
							<IonItem>
								<IonButton slot="end" onClick={() => setShowPopover(false)}>
									Cerrar
								</IonButton>
							</IonItem>
						</IonContent>
					</IonPopover>
				</IonCardContent>
			</IonCard>
		</>
	);
}
