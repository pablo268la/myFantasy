import {
	IonAccordion,
	IonAccordionGroup,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonRouterLink,
	IonRow,
	IonTitle,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getLigasUsuario } from "../../endpoints/ligasEndpoints";
import { urlBackground2 } from "../../helpers/helpers";
import { Liga } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { CartaLiga } from "./CartaLiga";

type VistaLigasProps = {
	email: string;
	token: string;
};

export function VistaLigas(props: VistaLigasProps): JSX.Element {
	const [crearLigas, setCrearLigas] = useState<boolean>(false);

	const [ligas, setLigas] = useState<Liga[]>();

	useEffect(() => {
		getLigasUsuario().then((ligas) => {
			setLigas(ligas);
		});
	}, []);

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
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
											{ligas?.map((liga) => (
												<CartaLiga liga={liga} />
											))}
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
								<IonRouterLink href="/ligas/create">
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
								</IonRouterLink>
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
				</IonContent>
			</IonPage>
		</>
	);
}
