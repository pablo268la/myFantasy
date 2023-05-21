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
	IonRouterLink,
	IonRow,
	IonSelect,
	IonSelectOption,
	useIonRouter,
	useIonToast,
} from "@ionic/react";
import { settings } from "ionicons/icons";
import { useState } from "react";
import { añadirUsuarioALiga, crearLiga } from "../../endpoints/ligasEndpoints";
import { setLocalLigaSeleccionada } from "../../helpers/helpers";
import { Liga } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";

export function VistaCrearLiga(props: any): JSX.Element {
	const navigate = useIonRouter();
	const [showLoading, setShowLoading] = useState(false);

	const [nombreLiga, setNombreLiga] = useState<string>();
	const [maxPlayers, setMaxPlayers] = useState<number>(0);
	const [ligaPrivada, setLigaPrivada] = useState<boolean>(false);

	const vaciarFormulario = () => {
		setNombreLiga("");
		setMaxPlayers(0);
		setLigaPrivada(false);
	};

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const validarYcrearLiga = async () => {
		setShowLoading(true);
		if (nombreLiga === undefined || nombreLiga === "") {
			crearToast("El nombre de la liga no puede estar vacío", true, "danger");
			setShowLoading(false);
			return;
		}
		if (maxPlayers < 3 || maxPlayers > 8) {
			crearToast(
				"El número de jugadores debe estar entre 2 y 8",
				true,
				"danger"
			);
			setShowLoading(false);
			return;
		}

		await crearLiga(nombreLiga, maxPlayers, ligaPrivada)
			.then(async (response: Liga) => {
				vaciarFormulario();
				await añadirUsuarioALiga(response.id as string)
					.then(() => {
						setLocalLigaSeleccionada(response.id as string);
						crearToast("Liga creada correctamente", true, "success");
						navigate.push("/plantilla/starts/" + response.id, "forward");
						setShowLoading(false);
					})
					.catch((err) => {
						setShowLoading(false);
						crearToast(err, true, "danger");
					});
			})
			.catch((err) => {
				setShowLoading(false);
				crearToast(err, true, "danger");
			});
	};

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonLoading isOpen={showLoading} message={"Creando una liga. Ten paciencia..."} />
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
									Nueva liga
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
											onClick={() => setLigaPrivada(!ligaPrivada)}
										></IonCheckbox>
										<IonLabel>Liga privada</IonLabel>
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
										<IonRouterLink href="/ligas">
											<IonButton color={"danger"}>Cancelar</IonButton>
										</IonRouterLink>
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
