import {
	IonAccordion,
	IonAccordionGroup,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonItem,
	IonLabel,
	IonList,
	IonRow,
	IonTitle
} from "@ionic/react";
import { useState } from "react";
import { CartaLiga } from "./CartaLiga";
import { urlBackground2 } from "./helpers";

export function VistaLigas(props: any): JSX.Element {
	const [crearLigas, setCrearLigas] = useState<boolean>(false);

	return (
		<>
			<IonContent>
				<IonRow>
					<IonCol size="4">
						<IonAccordionGroup value={"first"}>
							<IonAccordion value="first">
								<IonItem slot="header" color="light">
									<IonLabel>MIS LIGAS</IonLabel>
								</IonItem>
								<div className="ion-padding" slot="content">
									<IonList>
										<CartaLiga />
									</IonList>
								</div>
							</IonAccordion>
						</IonAccordionGroup>
						<IonRow style={{ justifyContent: "center" }}>
							<IonButton shape="round" onClick={() => setCrearLigas(true)}>
								Nueva liga
							</IonButton>
						</IonRow>
					</IonCol>
					{crearLigas ? (
						<IonCol size="4">
							<IonTitle>
								<IonItem>LIGAS DISPONIBLES</IonItem>
							</IonTitle>
							<IonCard>
								<IonCardContent
									style={{
										background: urlBackground2,
									}}
								>
									<IonRow style={{ justifyContent: "center" }}>
										<IonLabel
											style={{ fontSize: "18px", fontWeight: "bold" }}
											color={"light"}
										>
											Crear nueva liga
										</IonLabel>
									</IonRow>
								</IonCardContent>
							</IonCard>
							<IonCard>
								<IonCardContent
									style={{
										background: urlBackground2,
									}}
								>
									<IonRow style={{ justifyContent: "center" }}>
										<IonLabel
											style={{ fontSize: "18px", fontWeight: "bold" }}
											color={"light"}
										>
											Unirse a liga aleatoria
										</IonLabel>
									</IonRow>
								</IonCardContent>
							</IonCard>
							<IonCard>
								<IonCardContent
									style={{
										background: urlBackground2,
									}}
								>
									<IonRow style={{ justifyContent: "center" }}>
										<IonLabel
											style={{ fontSize: "18px", fontWeight: "bold" }}
											color={"light"}
										>
											Unirse a liga con código
										</IonLabel>
									</IonRow>
								</IonCardContent>
							</IonCard>
							<IonRow style={{ justifyContent: "center" }}>
								<IonButton shape="round" onClick={() => setCrearLigas(false)}>
									Cancelar
								</IonButton>
							</IonRow>
						</IonCol>
					) : (
						<></>
					)}
				</IonRow>

				{/* <iframe
					id="sofa-standings-embed-36-42409"
					width="100%"
					height="717"
					src="https://www.sofascore.com/es/torneo/36/42409/clasificacion/tablas/introducir"
					scrolling="yes"
					style={{ height: "717px" }}
				></iframe> */}
			</IonContent>
		</>
	);
}
