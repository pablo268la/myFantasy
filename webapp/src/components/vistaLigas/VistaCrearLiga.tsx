import {
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonRow,
    IonText,
} from "@ionic/react";
import { settings } from "ionicons/icons";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";

export function VistaCrearLiga(props: any): JSX.Element {
	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonContent style={{ justifyContent: "center" }}>
					<IonGrid style={{ width: 500 }}>
						<IonRow style={{ justifyContent: "center" }}>
							<IonIcon
								style={{ fontSize: "70px", color: "#562765" }}
								icon={settings}
							/>
						</IonRow>
						<IonRow style={{ justifyContent: "center" }}>
							<IonText>Crear Liga</IonText>
						</IonRow>
						<IonRow style={{ justifyContent: "center" }}>
							<IonCol>
								<IonItem>
									<IonLabel position="floating">Nombre</IonLabel>
									<IonInput
										type="text"
										onIonChange={(e) => {
											//setEmail(e.detail.value!.trim());
										}}
									></IonInput>
								</IonItem>
								<IonItem>
									<IonLabel position="floating"> User</IonLabel>
									<IonInput
										type="number"
										min={2}
										max={8}
										onIonChange={(e) => {
											//setContraseña(e.detail.value!.trim());
										}}
									></IonInput>
								</IonItem>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonContent>
			</IonPage>
		</>
	);
}
