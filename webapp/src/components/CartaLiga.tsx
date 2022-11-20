import {
	IonActionSheet,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonIcon,
	IonRow,
	IonTitle
} from "@ionic/react";
import { share, trash, trophySharp } from "ionicons/icons";
import { useState } from "react";
import { Liga } from "../shared/sharedTypes";
import { urlBackground2 } from "./helpers";

type CartaLigaProps = {
	liga: Liga;
};

export function CartaLiga(props: any): JSX.Element {
	const [showActionSheet, setShowActionSheet] = useState(false);

	const [liga, setLiga] = useState<Liga>(props.liga);


	return (
		<>
			<IonCard>
				<IonCardContent
					style={{
						background: urlBackground2,
					}}
				>
					<IonRow>
						<IonCol size="2">
							<br />
							<br />
							<IonIcon size="large" icon={trophySharp} color="light"></IonIcon>
						</IonCol>
						<IonCol>
							<IonRow>
								<IonTitle color={"light"}>{liga.nombre}</IonTitle>
								<IonButton onClick={() => setShowActionSheet(true)}>
									A
								</IonButton>
							</IonRow>
							<br />
							<br />
							<br />
							<IonRow>
								<IonTitle color={"light"}>Puntos</IonTitle>
								<IonTitle color={"light"}>Dinero</IonTitle>
								<IonTitle color={"light"}>Posicion</IonTitle>
							</IonRow>
						</IonCol>
					</IonRow>
					<IonRow></IonRow>

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
