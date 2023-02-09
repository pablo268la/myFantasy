import {
	IonActionSheet,
	IonButton,
	IonContent,
	IonHeader,
	IonPage,
} from "@ionic/react";
import { caretForwardCircle, close, heart, trash } from "ionicons/icons";
import { useState } from "react";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";

type ClassificacionProps = {};

function VistaClasificacion(props: ClassificacionProps): JSX.Element {
	const [showActionSheet, setShowActionSheet] = useState(false);
	const [idLiga, setIdLiga] = useState<String>(
		window.location.pathname.split("/")[2]
	);
	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonContent>
					<IonButton onClick={() => setShowActionSheet(true)}>
						Show Action Sheet
					</IonButton>

					<IonActionSheet
						isOpen={showActionSheet}
						onDidDismiss={() => setShowActionSheet(false)}
						buttons={[
							{
								text: "Delete",
								role: "destructive",
								icon: trash,
								id: "delete-button",
								data: {
									type: "delete",
								},
								handler: () => {
									console.log("Delete clicked");
								},
							},
							{
								text: "Play (open modal)",
								icon: caretForwardCircle,
								data: "Data value",
								handler: () => {
									console.log("Play clicked");
								},
							},
							{
								text: "Favorite",
								icon: heart,
								handler: () => {
									console.log("Favorite clicked");
								},
							},
							{
								text: "Cancel",
								icon: close,
								role: "cancel",
								handler: () => {
									console.log("Cancel clicked");
								},
							},
						]}
					></IonActionSheet>
				</IonContent>
			</IonPage>
		</>
	);
}

export default VistaClasificacion;
