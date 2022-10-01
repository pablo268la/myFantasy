import {
	IonCol,
	IonContent,
	IonHeader,
	IonList,
	IonPage,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getJugadorById, getPlantilla } from "../api/api";
import { Jugador, PlantillaUsuario } from "../shared/sharedTypes";
import { Alineacion } from "./Alineacion";
import { CartaDetallesJugador } from "./CartaDetallesJugador";
import { ListaJugadores } from "./ListaJugadores";
import { MenuLateral } from "./MenuLateral";

export type Formacion = {
	portero: number;
	defensa: number;
	medio: number;
	delantero: number;
};

export function VistaPlantilla(props: any): JSX.Element {
	const [plantilla, setPlantilla] = useState<PlantillaUsuario>();
	const [formacion, setFormacion] = useState<Formacion>({
		portero: 1,
		defensa: 4,
		medio: 3,
		delantero: 3,
	});
	const [jugadorPulsado, setJugadorPulsado] = useState<string>("");
	const [jugadores, setJugadores] = useState<Jugador[]>([]);

	const cambiarJugador = (idJugador: string) => {
		console.log(jugadorPulsado);
		if (idJugador === jugadorPulsado) setJugadorPulsado("");
		else setJugadorPulsado(idJugador);
	};

	const getJugadoresAPI = async () => {
		await getPlantilla().then((res) => {
			setPlantilla(res[0]);
			setFormacion({
				portero: 1, 
				defensa: Number(res[0].alineacion.formacion.split("-")[0]),
				medio: Number(res[0].alineacion.formacion.split("-")[1]),
				delantero: Number(res[0].alineacion.formacion.split("-")[2]),
			});

			plantilla?.jugadores.forEach(async (j) => {
				let jugador = await getJugadorById(j);
				if (jugadores.find((ju) => ju._id === jugador._id) === undefined)
					setJugadores((jugadores) => [...jugadores, jugador]);
			});
		});
	};

	useEffect(() => {
		getJugadoresAPI();
	}, []);

	return plantilla ? (
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
						<IonCol>
							<div>
								<IonList style={{ width: 200 }}>
									<IonSelect
										interface="popover"
										placeholder="4-3-3"
										onIonChange={(e) => {
											let f: Formacion = {
												portero: 1,
												defensa: e.detail.value.split("-")[0],
												medio: e.detail.value.split("-")[1],
												delantero: e.detail.value.split("-")[2],
											};
											setFormacion(f);
										}}
									>
										<IonSelectOption value="5-3-2">5-3-2</IonSelectOption>
										<IonSelectOption value="5-4-1">5-4-1</IonSelectOption>
										<IonSelectOption value="4-5-1">4-5-1</IonSelectOption>
										<IonSelectOption value="4-4-2">4-4-2</IonSelectOption>
										<IonSelectOption value="4-3-3">4-3-3</IonSelectOption>
										<IonSelectOption value="3-5-2">3-5-2</IonSelectOption>
										<IonSelectOption value="3-4-3">3-4-3</IonSelectOption>
									</IonSelect>
								</IonList>
							</div>
							<IonRow>
								<div
									style={{
										width: 650,
										height: 600,
										backgroundImage:
											"url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/225px-Soccer_Field_Transparant.svg.png)",
										backgroundSize: "cover",
										marginBottom: 25,
									}}
								>
									<Alineacion
										plantilla={plantilla}
										formacion={formacion}
										setJugadorPulsado={cambiarJugador}
										jugadores={jugadores}
									/>
								</div>

								<div style={{ width: 540, height: 600, marginLeft: "1%" }}>
									{jugadorPulsado === "" ? (
										<ListaJugadores
											plantilla={plantilla}
											jugadores={jugadores}
										/>
									) : (
										<>
											<CartaDetallesJugador
												jugador={jugadores.find(
													(j) => j._id === jugadorPulsado
												)}
												esParaCambio={true}
												plantilla={plantilla}
											/>
										</>
									)}
								</div>
							</IonRow>
						</IonCol>
					</IonRow>
				</IonContent>
			</IonPage>
		</>
	) : (
		<></>
	);
}
