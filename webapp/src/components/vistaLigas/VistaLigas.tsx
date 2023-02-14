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
	IonProgressBar,
	IonRouterLink,
	IonRow,
	IonTitle,
	useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
	añadirUsuarioALiga,
	checkJoinLiga,
	getLigasUsuario,
	getRandomLiga,
} from "../../endpoints/ligasEndpoints";
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
	const [loading, setLoading] = useState<boolean>(false);
	const [crearLigas, setCrearLigas] = useState<boolean>(false);

	const [ligas, setLigas] = useState<Liga[]>();

	const [uniendoseALiga, setUniendoseALiga] = useState<boolean>(false);
	const [unidoALiga, setUnidoALiga] = useState<boolean>(false);

	const [idLigaParaUnir, setIdLigaParaUnir] = useState<string>();

	const [presentAlert] = useIonAlert();
	const [enlaceInvitacion, setEnlaceInvitacion] = useState<string>();

	useEffect(() => {
		getLigasUsuario()
			.then((ligas) => {
				setLigas(ligas);
			})
			.catch((error) => {
				alert(error.message);
			});
	}, []);

	const unirseALigaAleatoria = async () => {
		getRandomLiga()
			.then(async (liga) => {
				setIdLigaParaUnir(liga._id);
				setLoading(true);
				setUniendoseALiga(true);

				await añadirUsuarioALiga(idLigaParaUnir as string)
					.then(() => {
						setUnidoALiga(true);
					})
					.catch((error) => {
						alert(error.message);
					});

				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				alert(error.message);
			});
	};

	const unirseConEnlace = async (enlace: string) => {
		setLoading(true);

		setUniendoseALiga(true);
		let e = enlace.split(":")[1];
		setEnlaceInvitacion(e);

		await checkJoinLiga(e)
			.then(async (canJoin) => {
				if (canJoin) {
					await añadirUsuarioALiga(e)
						.then(() => {
							setIdLigaParaUnir(e);
							setUnidoALiga(true);
						})
						.catch((error) => {
							alert(error.message);
						});
				} else {
					alert(
						"No te puedes unir a tu liga. Has llegado al maximo (5) o está completa"
					);
					setUniendoseALiga(false);
				}
			})
			.catch((error) => {
				alert(error.message);
			});

		setLoading(false);
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
														<CartaLiga liga={liga} disabled={uniendoseALiga} />
													))}
												</IonList>
											</div>
										</IonAccordion>
									</IonAccordionGroup>
									<IonRow style={{ justifyContent: "center" }}>
										<IonButton
											disabled={uniendoseALiga}
											shape="round"
											onClick={() => setCrearLigas(true)}
										>
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
											<IonCard disabled={uniendoseALiga}>
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
											disabled={uniendoseALiga}
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
											disabled={uniendoseALiga}
											onClick={() => {
												presentAlert({
													header: "Please enter your info",
													buttons: ["OK"],
													inputs: [
														{
															placeholder: "Introduce el código de invitación",
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
											{unidoALiga ? (
												<IonRouterLink
													href={"/plantilla/starts/" + idLigaParaUnir}
												>
													<IonButton>Ver plantilla</IonButton>
												</IonRouterLink>
											) : (
												//TODO - Probar a hacer click programaticamente
												<></>
											)}
											<IonButton
												disabled={uniendoseALiga}
												shape="round"
												onClick={() => {
													setCrearLigas(false);
													setUnidoALiga(false);
													setUniendoseALiga(false);
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
						</>
					) : (
						<>
							<IonProgressBar type="indeterminate"></IonProgressBar>
						</>
					)}
				</IonContent>
			</IonPage>
		</>
	);
}
