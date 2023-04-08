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
	PuntuacionJugador,
} from "../../../shared/sharedTypes";
import { Formacion } from "../VistaPlantilla";
import { AlineacionPuntuaciones } from "./AlineacionPuntuaciones";
import { CartaDetallesPuntuacionJugador } from "./CartaDetallesPuntuacionJugador";
import { ListaJugadoresPuntuaciones } from "./ListaJugadoresPuntuaciones";

type VistaPuntaucionesProps = {
	plantilla: PlantillaUsuario;
	formacion: Formacion;
	jugadores: PropiedadJugador[];
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	puntuacionesMap: Map<string, PuntuacionJugador[]>;
};

export function VistaPuntauciones(props: VistaPuntaucionesProps): JSX.Element {
	const [jugadorPulsado, setJugadorPulsado] = useState<string>("");

	const cambiarJugador = (idJugador: string) => {
		if (idJugador === jugadorPulsado) setJugadorPulsado("");
		else setJugadorPulsado(idJugador);
	};

	const cambiarJugadorSiOSi = (idJugador: string) => {
		if (jugadorPulsado === "" && idJugador !== jugadorPulsado)
			setJugadorPulsado(idJugador);
		else setJugadorPulsado("");
	};

	const [jornada, setJornada] = useState<number>(1);
	const jornadas = Array.from(Array(38).keys());

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
													value={jornada}
													interface="popover"
													onIonChange={(e) => {
														setJornada(e.detail.value);
														setJugadorPulsado("");
													}}
												>
													{jornadas.map((j) => {
														return (
															<IonSelectOption key={j + 1} value={j + 1}>
																<IonText>Jornada {j + 1}</IonText>
															</IonSelectOption>
														);
													})}
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
										<AlineacionPuntuaciones
											usuario={props.plantilla.usuario}
											formacion={props.formacion}
											setJugadorPulsado={cambiarJugadorSiOSi}
											porteros={props.porteros}
											defensas={props.defensas}
											mediocentros={props.mediocentros}
											delanteros={props.delanteros}
											jornada={jornada}
											puntuacionesMap={props.puntuacionesMap}
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
												jornada={jornada}
												puntuacionesMap={props.puntuacionesMap}
											/>
										) : (
											<>
												<CartaDetallesPuntuacionJugador
													propiedadJugador={props.jugadores.find(
														(j) => j.jugador._id === jugadorPulsado
													)}
													showPuntuaciones={true}
													setJugadorPulsado={cambiarJugador}
													jornada={jornada}
													puntuacionesJugador={
														props.puntuacionesMap.get(
															jugadorPulsado
														) as PuntuacionJugador[]
													}
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
