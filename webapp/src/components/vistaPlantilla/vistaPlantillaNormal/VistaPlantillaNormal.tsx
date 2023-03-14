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
import { getUsuarioLogueado } from "../../../helpers/helpers";
import {
    PlantillaUsuario,
    PropiedadJugador,
} from "../../../shared/sharedTypes";
import { Formacion } from "../VistaPlantilla";
import { Alineacion } from "./Alineacion";
import { CartaDetallesJugador } from "./CartaDetallesJugador";
import { ListaJugadores } from "./ListaJugadores";

type VistaPlantillaNormalProps = {
	plantilla: PlantillaUsuario;
	jugadores: PropiedadJugador[];
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	mediocentros: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	jornada: number;
	setJornada: (jornada: number) => void;
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
	guardarPlantilla: () => void;
	setValueFormacion: (f: string) => void;
};

export function VistaPlantillaNormal(
	props: VistaPlantillaNormalProps
): JSX.Element {
	const idPlantillaUsuario: string = window.location.pathname.split("/")[2];
	const sameUsuario: boolean = idPlantillaUsuario === getUsuarioLogueado()?.id;

	const cambiarJugador = (idJugador: string) => {
		if (idJugador === props.jugadorPulsado) props.setJugadorPulsado("");
		else props.setJugadorPulsado(idJugador);
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
													<IonSelectOption value="5-3-2">5-3-2</IonSelectOption>
													<IonSelectOption value="5-4-1">5-4-1</IonSelectOption>
													<IonSelectOption value="4-5-1">4-5-1</IonSelectOption>
													<IonSelectOption value="4-4-2">4-4-2</IonSelectOption>
													<IonSelectOption value="4-3-3">4-3-3</IonSelectOption>
													<IonSelectOption value="3-5-2">3-5-2</IonSelectOption>
													<IonSelectOption value="3-4-3">3-4-3</IonSelectOption>
												</IonSelect>
											</IonList>
										</IonCol>
										<IonCol size="6">
											{props.cambioAlineacion ? (
												<IonButton onClick={() => props.guardarPlantilla()}>
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
											setJugadorPulsado={cambiarJugador}
											porteros={props.porteros}
											defensas={props.defensas}
											mediocentros={props.mediocentros}
											delanteros={props.delanteros}
										/>
									</IonRow>
								</IonCol>

								<IonCol sizeSm="5" sizeXs="12" style={{ height: "100%" }}>
									<IonContent>
										{props.jugadorPulsado === "" ? (
											<ListaJugadores
												porteros={props.porteros}
												defensas={props.defensas}
												mediocentros={props.mediocentros}
												delanteros={props.delanteros}
												formacion={props.formacion}
												cambiarTitulares={props.cambiarTitulares}
												isSameUser={sameUsuario}
												jornada={props.jornada}
											/>
										) : (
											<>
												<CartaDetallesJugador
													propiedadJugador={props.jugadores.find(
														(j) => j.jugador._id === props.jugadorPulsado
													)}
													esParaCambio={true}
													posicion={props.jugadorPulsado}
													porteros={props.porteros}
													defensas={props.defensas}
													mediocentros={props.mediocentros}
													delanteros={props.delanteros}
													formacion={props.formacion}
													cambiarTitulares={props.cambiarTitulares}
													isSameUser={sameUsuario}
													setJugadorSeleccionadoMethod={() => {}}
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