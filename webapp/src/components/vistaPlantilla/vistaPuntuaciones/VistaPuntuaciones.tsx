import {
	IonCol,
	IonContent,
	IonGrid,
	IonList,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonText,
} from "@ionic/react";
import { useState } from "react";
import {
	PlantillaUsuario,
	PropiedadJugador,
} from "../../../shared/sharedTypes";
import { Formacion } from "../VistaPlantilla";
import { Alineacion } from "../vistaPlantillaNormal/Alineacion";
import { CartaPuntuacionJugador } from "./CartaPuntuacionJugador";
import { ListaJugadoresPuntuaciones } from "./ListaJugadoresPuntuaciones";

type VistaPuntaucionesProps = {
	plantilla: PlantillaUsuario;
	formacion: Formacion;
	jugadores: PropiedadJugador[];
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	setJornada: (jornada: number) => void;
	jornada: number;
};

export function VistaPuntauciones(props: VistaPuntaucionesProps): JSX.Element {
	const [jugadorPulsado, setJugadorPulsado] = useState<string>("");

	const cambiarJugador = (idJugador: string) => {
		if (idJugador === jugadorPulsado) setJugadorPulsado("");
		else setJugadorPulsado(idJugador);
	};

	const cambiarJugadorSiOSi = (idJugador: string) => {
		if (idJugador === jugadorPulsado) setJugadorPulsado("");
		else if (jugadorPulsado === "") setJugadorPulsado(idJugador);
		else setJugadorPulsado("");
	};

	return (
		<>
			<IonContent>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonRow style={{ height: "100%" }}>
								<IonCol sizeSm="7" sizeXs="12">
									<IonRow>
										<IonCol>
											<IonList>
												<IonSelect
													value={props.jornada}
													interface="popover"
													onIonChange={(e) => {
														props.setJornada(e.detail.value);
													}}
												>
													<IonSelectOption value={1}>Jornada 1</IonSelectOption>
													<IonSelectOption value={2}>Jornada 2</IonSelectOption>
													<IonSelectOption value={3}>Jornada 3</IonSelectOption>
													<IonSelectOption value={4}>Jornada 4</IonSelectOption>
													<IonSelectOption value={5}>Jornada 5</IonSelectOption>
													<IonSelectOption value={6}>
														<IonText>Jornada 6 ---- 40 puntos</IonText>
													</IonSelectOption>
												</IonSelect>
											</IonList>
										</IonCol>
									</IonRow>
								</IonCol>
								<IonCol sizeSm="7" sizeXs="12">
									<IonRow
										style={{
											backgroundImage:
												"url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/225px-Soccer_Field_Transparant.svg.png)",
											backgroundSize: "cover",
											marginBottom: "2%",
										}}
									>
										<Alineacion
											usuario={props.plantilla.usuario}
											formacion={props.formacion}
											setJugadorPulsado={cambiarJugadorSiOSi}
											porteros={props.porteros}
											defensas={props.defensas}
											mediocentros={props.mediocentros}
											delanteros={props.delanteros}
										/>
									</IonRow>
								</IonCol>
								<IonCol sizeSm="5" sizeXs="12" style={{ height: "100%" }}>
									<IonContent>
										{jugadorPulsado === "" ? (
											<ListaJugadoresPuntuaciones
												porteros={props.porteros}
												defensas={props.defensas}
												mediocentros={props.mediocentros}
												delanteros={props.delanteros}
												setJugadorPulsado={cambiarJugador}
												jornada={props.jornada}
											/>
										) : (
											<>
												<CartaPuntuacionJugador
													propiedadJugador={props.jugadores.find(
														(j) => j.jugador._id === jugadorPulsado
													)}
													showPuntuaciones={true}
													setJugadorPulsado={cambiarJugador}
													jornada={props.jornada}
												/>
											</>
										)}
									</IonContent>
								</IonCol>
							</IonRow>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</>
	);
}
