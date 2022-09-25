import {
	IonCol,
	IonContent,
	IonHeader,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getJugadorById, getPlantilla } from "../api/api";
import { PlantillaUsuario } from "../shared/sharedTypes";
import { CartaJugador } from "./CartaJugador";
import { ListaJugadores } from "./ListaJugadores";
import { MenuLateral } from "./MenuLateral";

export function VistaPlantilla(props: any): JSX.Element {
	const [plantilla, setPlantilla] = useState<PlantillaUsuario>();

	const getJugadoresAPI = async () => {
		let p = await getPlantilla();
		setPlantilla(p[0]);
	};

	useEffect(() => {
		getJugadoresAPI();
	}, []);

	return (
		<>
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Mi plantilla</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonRow>
						<MenuLateral />
						<div
							style={{
								width: 600,
								height: 600,
								backgroundImage:
									"url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/225px-Soccer_Field_Transparant.svg.png)",
								backgroundSize: "cover",
								marginBottom: 25,
							}}
						>
							<IonRow>
								<IonCol offset="5">
									<CartaJugador jugador={j(plantilla?.jugadores[10] || "0")} />
								</IonCol>
							</IonRow>
							<IonRow>
								<IonCol>
									<CartaJugador jugador={j(plantilla?.jugadores[9] || "0")} />
								</IonCol>
								<IonCol>
									<CartaJugador jugador={j(plantilla?.jugadores[8] || "0")} />
								</IonCol>
								<IonCol>
									<CartaJugador jugador={j(plantilla?.jugadores[7] || "0")} />
								</IonCol>
								<IonCol>
									<CartaJugador jugador={j(plantilla?.jugadores[6] || "0")} />
								</IonCol>
							</IonRow>
							<IonRow>
								<IonCol offset="1">
									<CartaJugador jugador={j(plantilla?.jugadores[5] || "0")} />
								</IonCol>
								<IonCol>
									<CartaJugador jugador={j(plantilla?.jugadores[4] || "0")} />
								</IonCol>
								<IonCol>
									<CartaJugador jugador={j(plantilla?.jugadores[3] || "0")} />
								</IonCol>
							</IonRow>
							<IonRow>
								<IonCol offset="1">
									<CartaJugador jugador={j(plantilla?.jugadores[2] || "0")} />
								</IonCol>
								<IonCol>
									<CartaJugador jugador={j(plantilla?.jugadores[1] || "0")} />
								</IonCol>
								<IonCol>
									<CartaJugador jugador={j(plantilla?.jugadores[0] || "0")} />
								</IonCol>
							</IonRow>
						</div>
						<div style={{ width: 540, height: 600, marginLeft: "1%" }}>
							<ListaJugadores
								plantilla={plantilla?.jugadores ? plantilla.jugadores : []}
							/>
						</div>
					</IonRow>
				</IonContent>
			</IonPage>
		</>
	);

	async function j(id: string) {
		return await getJugadorById(id);
	}
}
