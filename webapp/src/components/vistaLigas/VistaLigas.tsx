import {
	IonAccordion,
	IonAccordionGroup,
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonLoading,
	IonPage,
	IonProgressBar,
	IonRouterLink,
	IonRow,
	IonTitle,
	useIonAlert,
	useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
	añadirUsuarioALiga,
	checkJoinLiga,
	getLigasUsuario,
	getRandomLiga,
} from "../../endpoints/ligasEndpoints";
import {
	setLocalLigaSeleccionada,
	urlBackground2,
} from "../../helpers/helpers";
import { Liga } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { CartaLiga } from "./CartaLiga";

type VistaLigasProps = {
	email: string;
	token: string;
};

export function VistaLigas(props: VistaLigasProps): JSX.Element {
	const navigate = useIonRouter();
	const [alert] = useIonAlert();

	const [crearLigas, setCrearLigas] = useState<boolean>(false);

	const [ligas, setLigas] = useState<Liga[]>();

	const [idLigaParaUnir, setIdLigaParaUnir] = useState<string>();

	const [presentAlert] = useIonAlert();
	const [enlaceInvitacion, setEnlaceInvitacion] = useState<string>();
	const [showLoading, setShowLoading] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getLigasUsuario()
			.then((ligas) => {
				setLigas(ligas);
				setLoading(false);
			})
			.catch((error) => {
				alert(error.message);
				setLoading(false);
			});
	}, []);

	const unirseALigaAleatoria = async () => {
		setShowLoading(true);
		getRandomLiga()
			.then(async (liga) => {
				unirseConEnlace(liga.enlaceInvitacion);
			})
			.catch((error) => {
				alert(error.message);
			});
		setShowLoading(false);
	};

	const unirseConEnlace = async (enlace: string) => {
		setShowLoading(true);
		let e = enlace.split(":")[1];
		setEnlaceInvitacion(e);

		await checkJoinLiga(e)
			.then(async (canJoin) => {
				if (canJoin) {
					await añadirUsuarioALiga(e)
						.then(() => {
							setIdLigaParaUnir(e);
							setShowLoading(true);
							setLocalLigaSeleccionada(e);
							navigate.push("/plantilla/starts/" + e, "forward");
						})
						.catch((error) => {
							alert(error.message);
						});
				} else {
					alert(
						"No te puedes unir a tu liga. Has llegado al maximo (5) o está completa"
					);
					setShowLoading(false);
				}
			})
			.catch((error) => {
				alert(error.message);
			});

		setShowLoading(false);
	};

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonContent>
					{!loading ? (
						<>
							<IonLoading isOpen={showLoading} message={"Please wait..."} />
							<IonGrid>
								<IonRow>
									<IonCol sizeSm="6" sizeXs="12">
										<IonAccordionGroup value={"first"}>
											<IonAccordion value="first">
												<IonItem slot="header" color="light">
													<IonLabel>MIS LIGAS</IonLabel>
												</IonItem>
												<div className="ion-padding" slot="content">
													<IonList>
														{ligas?.map((liga) => (
															<CartaLiga
																key={liga._id}
																liga={liga}
																disabled={false}
															/>
														))}
													</IonList>
												</div>
											</IonAccordion>
										</IonAccordionGroup>
										<IonRow style={{ justifyContent: "center" }}>
											<IonButton
												shape="round"
												onClick={() => setCrearLigas(true)}
											>
												Nueva liga
											</IonButton>
										</IonRow>
									</IonCol>
									{crearLigas ? (
										<IonCol sizeSm="6" sizeXs="12">
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
											<IonCard
												onClick={() => {
													unirseALigaAleatoria();
												}}
											>
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
											<IonCard
												onClick={() => {
													presentAlert({
														header: "Please enter your info",
														buttons: ["OK"],
														inputs: [
															{
																placeholder:
																	"Introduce el código de invitación",
															},
														],
														onDidDismiss: (e) => {
															unirseConEnlace(e.detail.data.values[0]);
														},
													});
												}}
											>
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
												<IonButton
													shape="round"
													onClick={() => {
														setCrearLigas(false);
													}}
												>
													Cancelar
												</IonButton>
											</IonRow>
										</IonCol>
									) : (
										<></>
									)}
								</IonRow>
							</IonGrid>
						</>
					) : (
						<IonProgressBar type="indeterminate"></IonProgressBar>
					)}
				</IonContent>
			</IonPage>
		</>
	);
}
