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
	IonLoading,
	IonPage,
	IonRow,
	IonSelect,
	IonSelectOption,
	useIonAlert,
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
	const [alert] = useIonAlert();
	const navigate = useIonRouter();
	const [showLoading, setShowLoading] = useState(false);

	const [nombreLiga, setNombreLiga] = useState<string>();
	const [maxPlayers, setMaxPlayers] = useState<number>(0);
	const [usarEntrenador, setUsarEntrenador] = useState<boolean>(false);
	const [ligaPrivada, setLigaPrivada] = useState<boolean>(false);

	const vaciarFormulario = () => {
		setNombreLiga("");
		setMaxPlayers(0);
		setUsarEntrenador(false);
		setLigaPrivada(false);
	};

	const validarYcrearLiga = async () => {
		setShowLoading(true);
		if (nombreLiga === undefined || nombreLiga === "") {
			alert("El nombre de la liga no puede estar vacío");
			setShowLoading(false);
			return;
		}
		if (maxPlayers < 3 || maxPlayers > 8) {
			alert("El número de jugadores debe estar entre 2 y 8");
			setShowLoading(false);
			return;
		}

		await crearLiga(nombreLiga, maxPlayers, usarEntrenador)
			.then(async (response: Liga) => {
				vaciarFormulario();
				await crearPlantillaUsuario(response._id as string)
					.then(() => {
						navigate.push("/plantilla/starts/" + response._id, "forward");
						setShowLoading(false);
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
				<IonLoading isOpen={showLoading} message={"Please wait..."} />
				<IonContent
					style={{
						justifyContent: "center",
					}}
				>
					<IonGrid style={{ border: "2px solid #123445", maxWidth: 500 }}>
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
									<IonItem counter={true}>
										<IonLabel position="floating">Nombre de la liga</IonLabel>
										<IonInput
											maxlength={25}
											type="text"
											onIonChange={(e) => {
												setNombreLiga(e.detail.value!.trim());
											}}
										></IonInput>
									</IonItem>
									<IonItem style={{ width: "50%" }}>
										<IonLabel position="floating"> Max. jugadores</IonLabel>
										<IonSelect
											interface="popover"
											onIonChange={(e) => {
												setMaxPlayers(e.detail.value);
											}}
										>
											<IonSelectOption value="3">3</IonSelectOption>
											<IonSelectOption value="4">4</IonSelectOption>
											<IonSelectOption value="5">5</IonSelectOption>
											<IonSelectOption value="6">6</IonSelectOption>
											<IonSelectOption value="7">7</IonSelectOption>
											<IonSelectOption value="8">8</IonSelectOption>
										</IonSelect>
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
				</IonContent>
			</IonPage>
		</>
	);
}
