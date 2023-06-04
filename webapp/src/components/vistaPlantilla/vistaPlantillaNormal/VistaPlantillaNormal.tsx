import {
	IonButton,
	IonCol,
	IonContent,
	IonGrid,
	IonList,
	IonRow,
	IonSelect,
	IonSelectOption,
} from "@ionic/react";
import { useState } from "react";
import { getUsuarioLogueado } from "../../../helpers/helpers";
import {
	AlineacionJugador,
	PlantillaUsuario,
	PropiedadJugador,
	PuntuacionJugador,
} from "../../../shared/sharedTypes";
import { VolverAlInicio } from "../../comunes/VolverAlInicio";
import { Formacion } from "../VistaPlantilla";
import { Alineacion } from "./Alineacion";
import { CartaDetallesJugador } from "./CartaDetallesJugador";
import { ListaJugadores } from "./ListaJugadores";

type VistaPlantillaNormalProps = {
	plantilla: PlantillaUsuario;
	alineacion: AlineacionJugador;
	jugadores: PropiedadJugador[];
	formacion: Formacion;
	cambiarFormacion: (f: Formacion) => void;
	jugadorPulsado: string;
	setJugadorPulsado: (idJugador: string) => void;
	cambiarTitulares: (
		lista: PropiedadJugador[],
		idIn: string,
		idOut: string
	) => void;
	cambioAlineacion: boolean;
	guardarPlantilla: () => Promise<void>;
	setValueFormacion: (f: string) => void;
	setShowLoading: (show: boolean) => void;
	setMessage: (message: string) => void;
	crearToast: (message: string, show: boolean, color: string) => void;
	jornada: number;
};

export function VistaPlantillaNormal(
	props: VistaPlantillaNormalProps
): JSX.Element {
	const idPlantillaUsuario: string = window.location.pathname.split("/")[2];
	const sameUsuario: boolean = idPlantillaUsuario === getUsuarioLogueado()?.id;

	const [puntuacionesMap, setPuntuacionesMap] = useState<
		Map<string, PuntuacionJugador[]>
	>(new Map());

	const cambiarJugadorSiOSi = (idJugador: string) => {
		if (props.jugadorPulsado === "" && idJugador !== props.jugadorPulsado)
			props.setJugadorPulsado(idJugador);
		else props.setJugadorPulsado("");
	};

	const addPuntuacion = (
		idJugador: string,
		puntuaciones: PuntuacionJugador[]
	) => {
		const map = puntuacionesMap.set(idJugador, puntuaciones);
		setPuntuacionesMap(map);
	};

	return (
		<>
			{props.plantilla !== undefined ? (
				<IonContent>
					<IonGrid>
						<IonRow>
							<IonCol>
								<IonRow style={{ height: "100%" }}>
									<IonCol sizeSm="7" sizeXs="12">
										<IonRow>
											<IonCol size="6">
												<IonList style={{ maxWidth: 200 }}>
													<IonSelect
														disabled={!sameUsuario}
														interface="popover"
														placeholder={
															props.formacion.defensa +
															"-" +
															props.formacion.medio +
															"-" +
															props.formacion.delantero
														}
														onIonChange={(e) => {
															let f: Formacion = {
																portero: 1,
																defensa: Number(e.detail.value.split("-")[0]),
																medio: Number(e.detail.value.split("-")[1]),
																delantero: Number(e.detail.value.split("-")[2]),
															};
															props.setValueFormacion(e.detail.value);
															props.cambiarFormacion(f);
														}}
													>
														<IonSelectOption value="5-3-2">
															5-3-2
														</IonSelectOption>
														<IonSelectOption value="5-4-1">
															5-4-1
														</IonSelectOption>
														<IonSelectOption value="4-5-1">
															4-5-1
														</IonSelectOption>
														<IonSelectOption value="4-4-2">
															4-4-2
														</IonSelectOption>
														<IonSelectOption value="4-3-3">
															4-3-3
														</IonSelectOption>
														<IonSelectOption value="3-5-2">
															3-5-2
														</IonSelectOption>
														<IonSelectOption value="3-4-3">
															3-4-3
														</IonSelectOption>
													</IonSelect>
												</IonList>
											</IonCol>
											<IonCol size="6">
												{props.cambioAlineacion ? (
													<IonButton
														onClick={async () => {
															props.setMessage("Guardando cambios...");
															await props.guardarPlantilla();
														}}
													>
														Guardar cambios
													</IonButton>
												) : (
													<></>
												)}
											</IonCol>
										</IonRow>
										<IonRow
											style={{
												backgroundImage:
													"url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/225px-Soccer_Field_Transparant.svg.png)",
												backgroundSize: "cover",
												marginBottom: "2%",
											}}
										>
											<Alineacion
												usuario={props.plantilla?.usuario}
												formacion={props.formacion}
												setJugadorPulsado={cambiarJugadorSiOSi}
												porteros={props.alineacion.porteros}
												defensas={props.alineacion.defensas}
												mediocentros={props.alineacion.medios}
												delanteros={props.alineacion.delanteros}
											/>
										</IonRow>
									</IonCol>

									<IonCol sizeSm="5" sizeXs="12" style={{ height: "100%" }}>
										<IonContent>
											{props.jugadorPulsado === "" ? (
												<ListaJugadores
													porteros={props.alineacion.porteros}
													defensas={props.alineacion.defensas}
													mediocentros={props.alineacion.medios}
													delanteros={props.alineacion.delanteros}
													formacion={props.formacion}
													cambiarTitulares={props.cambiarTitulares}
													isSameUser={sameUsuario}
													jornada={props.jornada}
													crearToast={props.crearToast}
													addPuntuacion={addPuntuacion}
													puntuacionesMap={puntuacionesMap}
												/>
											) : (
												<>
													<CartaDetallesJugador
														propiedadJugador={props.jugadores.find(
															(j) => j.jugador.id === props.jugadorPulsado
														)}
														esParaCambio={true}
														posicion={props.jugadorPulsado}
														porteros={props.alineacion.porteros}
														defensas={props.alineacion.defensas}
														mediocentros={props.alineacion.medios}
														delanteros={props.alineacion.delanteros}
														formacion={props.formacion}
														cambiarTitulares={props.cambiarTitulares}
														isSameUser={sameUsuario}
														setJugadorSeleccionadoMethod={() => {}}
														crearToast={props.crearToast}
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
			) : (
				<VolverAlInicio message="No tienes ninguna liga" />
			)}
		</>
	);
}
