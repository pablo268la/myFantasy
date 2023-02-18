import {
	IonActionSheet,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonGrid,
	IonIcon,
	IonLabel,
	IonRouterLink,
	IonRow,
	IonTitle,
} from "@ionic/react";
import { ellipsisVertical, share, trash, trophySharp } from "ionicons/icons";
import { useState } from "react";
import { getUsuarioLogueado, urlBackground2 } from "../../helpers/helpers";
import { Liga } from "../../shared/sharedTypes";

type CartaLigaProps = {
	liga: Liga;
	disabled: boolean;
};

export function CartaLiga(props: CartaLigaProps): JSX.Element {
	const [showActionSheet, setShowActionSheet] = useState(false);

	const [liga, setLiga] = useState<Liga>(props.liga);
	const usuario = getUsuarioLogueado();
	//liga.usuarios.filter( f => f.id === usuario?.id).at(0)

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
							<IonCol style={{ justifyContent: "space-around" }}>
								{!props.disabled ? (
									<IonRouterLink
										href={"/plantilla/" + liga._id + "/" + usuario?.id}
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
										<IonRow>
											<IonTitle color={"light"}>Puntos</IonTitle>
											<IonTitle color={"light"}>Dinero</IonTitle>
											<IonTitle color={"light"}>Posicion</IonTitle>
										</IonRow>
									</IonRouterLink>
								) : (
									<>
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
										<IonRow>
											<IonTitle color={"light"}>Puntos</IonTitle>
											<IonTitle color={"light"}>Dinero</IonTitle>
											<IonTitle color={"light"}>Posicion</IonTitle>
										</IonRow>
									</>
								)}
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
