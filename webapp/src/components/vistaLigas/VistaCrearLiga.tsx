import {
	IonButton,
	IonCheckbox,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonPage,
	IonRouterLink,
	IonRow,
	useIonRouter,
} from "@ionic/react";
import { settings } from "ionicons/icons";
import { useState } from "react";
import { crearLiga } from "../../endpoints/ligasEndpoints";
import { crearPlantillaUsuario } from "../../endpoints/plantillaEndpoints";
import { Liga } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";

export function VistaCrearLiga(props: any): JSX.Element {
	const navigate = useIonRouter();

	const [nombreLiga, setNombreLiga] = useState<string>();
	const [maxPlayers, setMaxPlayers] = useState<number>(0);
	const [usarEntrenador, setUsarEntrenador] = useState<boolean>(false);
	const [ligaPrivada, setLigaPrivada] = useState<boolean>(false);

	const [ligaCreada, setLigaCreada] = useState<boolean>(false);
	const [idLiga, setIdLiga] = useState<string>();

	const vaciarFormulario = () => {
		setNombreLiga("");
		setMaxPlayers(0);
		setUsarEntrenador(false);
		setLigaPrivada(false);
	};

	const validarYcrearLiga = async () => {
		if (nombreLiga === undefined || nombreLiga === "") {
			alert("El nombre de la liga no puede estar vacío");
			return;
		}
		if (maxPlayers < 2 || maxPlayers > 8) {
			alert("El número de jugadores debe estar entre 2 y 8");
			return;
		}

		await crearLiga(nombreLiga, maxPlayers, usarEntrenador)
			.then(async (response: Liga) => {
				alert("Liga creada");
				vaciarFormulario();
				setIdLiga(response._id);
				await crearPlantillaUsuario(response._id as string)
					.then(() => {
						setLigaCreada(true);
					})
					.catch((error) => {
						alert(error.message);
					});
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonContent
					style={{
						justifyContent: "center",
					}}
				>
					{!ligaCreada ? (
						<IonGrid style={{ border: "2px solid #123445", width: 500 }}>
							<>
								<IonRow style={{ justifyContent: "center" }}>
									<IonIcon
										style={{ fontSize: "70px", color: "#562765" }}
										icon={settings}
									/>
								</IonRow>
								<IonRow style={{ justifyContent: "center" }}>
									<IonLabel
										style={{
											fontSize: "30px",
											fontWeight: "bold",
											marginBottom: "15px",
										}}
									>
										Crea tu liga con amigos
									</IonLabel>
								</IonRow>
								<IonRow style={{ justifyContent: "center" }}>
									<IonCol>
										<IonItem>
											<IonLabel position="floating">Nombre de la liga</IonLabel>
											<IonInput
												type="text"
												onIonChange={(e) => {
													setNombreLiga(e.detail.value!.trim());
												}}
											></IonInput>
										</IonItem>
										<IonItem style={{ width: "50%" }}>
											<IonLabel position="floating"> Max. jugadores</IonLabel>
											<IonInput
												type="number"
												min={2}
												max={8}
												onIonChange={(e) => {
													const p = parseInt(e.detail.value!);
													if (p < 2) setMaxPlayers(2);
													else if (p > 8) setMaxPlayers(8);
													else setMaxPlayers(p);
												}}
											></IonInput>
										</IonItem>
									</IonCol>
								</IonRow>
								<IonRow
									style={{
										justifyContent: "center",
										marginTop: "30px",
									}}
								>
									<IonLabel
										style={{
											fontSize: "30px",
											fontWeigth: "bold",
										}}
									>
										Opciones de liga
									</IonLabel>
								</IonRow>
								<IonRow style={{ justifyContent: "center" }}>
									<IonCol>
										<IonItem>
											<IonCheckbox
												slot="start"
												onClick={() => setUsarEntrenador(!usarEntrenador)}
											></IonCheckbox>
											<IonLabel>Utilizar entrenadores</IonLabel>
										</IonItem>
									</IonCol>
								</IonRow>
								<IonRow style={{ justifyContent: "center" }}>
									<IonCol>
										<IonItem>
											<IonButton
												slot="end"
												color={"primary"}
												onClick={() => validarYcrearLiga()}
											>
												Crear
											</IonButton>
											<IonButton color={"danger"}>Cancelar</IonButton>
										</IonItem>
									</IonCol>
								</IonRow>
							</>
						</IonGrid>
					) : (
						<>
							<IonRouterLink href={("/plantilla/starts/" + idLiga) as string}>
								<IonButton> Ver plantilla</IonButton>
							</IonRouterLink>
						</>
					)}
				</IonContent>
			</IonPage>
		</>
	);
}
