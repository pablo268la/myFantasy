import {
	IonActionSheet,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonGrid,
	IonIcon,
	IonLabel,
	IonRow,
} from "@ionic/react";
import { ellipsisVertical, share, trash, trophySharp } from "ionicons/icons";
import { useState } from "react";
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
};

export function CartaLiga(props: CartaLigaProps): JSX.Element {
	const [showActionSheet, setShowActionSheet] = useState(false);

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
									setLocalLigaSeleccionada(liga._id as string);
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
								handler: () => {},
							},
							{
								text: "Compartir",
								icon: share,
								handler: () => {},
							},
						]}
					></IonActionSheet>
				</IonCardContent>
			</IonCard>
		</>
	);
}
