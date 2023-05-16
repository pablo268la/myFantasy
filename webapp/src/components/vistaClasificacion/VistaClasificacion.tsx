import {
	IonContent,
	IonGrid,
	IonHeader,
	IonLabel,
	IonList,
	IonPage,
	IonProgressBar,
	IonRow,
	useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getLiga } from "../../endpoints/ligasEndpoints";
import { getLocalLigaSeleccionada } from "../../helpers/helpers";
import { Liga, PlantillaUsuario } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { CartaClasificaion } from "./CartaClasificacion";

type ClassificacionProps = {};

function VistaClasificacion(props: ClassificacionProps): JSX.Element {
	const [loading, setLoading] = useState<boolean>(true);

	const [liga, setLiga] = useState<Liga>();

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const getLigaFromAPI = async () => {
		await getLiga(getLocalLigaSeleccionada())
			.then((liga) => {
				setLiga(liga);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				crearToast(err, true, "danger");
			});
	};

	useEffect(() => {
		getLigaFromAPI().catch((err) => {
			crearToast(err, true, "danger");
		});
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
													(p) => p.id === plantilla.id
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
