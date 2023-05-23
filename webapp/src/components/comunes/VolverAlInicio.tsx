import {
	IonButton,
	IonContent,
	IonLabel,
	IonRouterLink,
	IonRow,
} from "@ionic/react";

export function VolverAlInicio(props: any): JSX.Element {
	return (
		<>
			<IonContent>
				<IonRow style={{ justifyContent: "center", marginTop: "5%" }}>
					<IonLabel>Aqui no hay nada para ti</IonLabel>
				</IonRow>
				<IonRow style={{ justifyContent: "center", marginTop: "5%" }}>
					<IonRouterLink href="/home">
						<IonButton fill="outline" size="large">
							<IonLabel>Volver al inicio</IonLabel>
						</IonButton>
					</IonRouterLink>
				</IonRow>
			</IonContent>
		</>
	);
}
