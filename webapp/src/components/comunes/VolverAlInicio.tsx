import {
	IonButton,
	IonContent,
	IonLabel,
	IonRouterLink,
	IonRow,
} from "@ionic/react";

type VolverAlInicioProps = {
	message: string;
};

export function VolverAlInicio(props: VolverAlInicioProps): JSX.Element {
	return (
		<>
			<IonContent>
				<IonRow style={{ justifyContent: "center", marginTop: "5%" }}>
					<IonLabel>{props.message}</IonLabel>
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
