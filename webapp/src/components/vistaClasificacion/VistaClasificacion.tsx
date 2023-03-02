import {
	IonContent,
	IonGrid,
	IonHeader,
	IonLabel,
	IonList,
	IonPage,
	IonProgressBar,
	IonRow,
	useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getLiga } from "../../endpoints/ligasEndpoints";
import { getUsuarioLogueado } from "../../helpers/helpers";
import { Liga, PlantillaUsuario, Usuario } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { CartaClasificaion } from "./CartaClasificacion";

type ClassificacionProps = {};

function VistaClasificacion(props: ClassificacionProps): JSX.Element {
	const [alert] = useIonAlert();
	const [loading, setLoading] = useState<boolean>(true);

	const [idLiga, setIdLiga] = useState<string>(
		window.location.pathname.split("/")[2]
	);
	const [usuario, setUsuario] = useState<Usuario>(
		getUsuarioLogueado() as Usuario
	);
	const [liga, setLiga] = useState<Liga>();

	const getLigaFromAPI = async () => {
		await getLiga(idLiga)
			.then((liga) => {
				setLiga(liga);
				setLoading(false);
			})
			.catch((error) => alert(error.message));
	};

	useEffect(() => {
		getLigaFromAPI();
	}, []);

	const ordenarPorPuntos = (a: PlantillaUsuario, b: PlantillaUsuario) => {
		if (a.puntos > b.puntos) {
			return -1;
		}
		if (a.puntos < b.puntos) {
			return 1;
		}
		return 0;
	};

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonContent>
					{loading ? (
						<IonProgressBar type="indeterminate"></IonProgressBar>
					) : (
						<IonGrid>
							<IonRow style={{ justifyContent: "center" }}>
								<IonLabel
									style={{
										whiteSpace: "normal",
										fontSize: "30px",
										fontWeight: "bold",
									}}
								>
									{liga?.nombre}
								</IonLabel>
							</IonRow>
							<IonRow style={{ justifyContent: "center" }}>
								<IonList style={{ width: "100%", maxWidth: "500px" }}>
									{liga?.plantillasUsuarios
										.sort(ordenarPorPuntos)
										.map((plantilla) => (
											<CartaClasificaion
												plantilla={plantilla}
												posicion={liga.plantillasUsuarios.findIndex(
													(p) => p._id === plantilla._id
												)}
											/>
										))}
								</IonList>
							</IonRow>
						</IonGrid>
					)}
				</IonContent>
			</IonPage>
		</>
	);
}

export default VistaClasificacion;
