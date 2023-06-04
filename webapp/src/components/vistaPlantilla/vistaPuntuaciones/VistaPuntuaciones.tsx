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
import { useEffect, useState } from "react";
import { getPuntuacionJugadorSemana } from "../../../endpoints/puntuacionesEndpoint";
import {
	AlineacionJugador,
	PlantillaUsuario,
	PropiedadJugador,
	PuntuacionJugador,
} from "../../../shared/sharedTypes";
import { VolverAlInicio } from "../../comunes/VolverAlInicio";
import { Formacion } from "../VistaPlantilla";
import { AlineacionPuntuaciones } from "./AlineacionPuntuaciones";
import { CartaDetallesPuntuacionJugador } from "./CartaDetallesPuntuacionJugador";
import { ListaJugadoresPuntuaciones } from "./ListaJugadoresPuntuaciones";

type VistaPuntuacionesProps = {
	plantilla: PlantillaUsuario;
	formacion: Formacion;
	jugadores: PropiedadJugador[];
	alineacionJugador: AlineacionJugador;
	jornada: number;
};

export function VistaPuntuaciones(props: VistaPuntuacionesProps): JSX.Element {
	const [jugadorPulsado, setJugadorPulsado] = useState<string>("");
	const [loading, setLoading] = useState<boolean>();

	const cambiarJugador = (idJugador: string) => {
		if (idJugador === jugadorPulsado) setJugadorPulsado("");
		else setJugadorPulsado(idJugador);
	};

	const cambiarJugadorSiOSi = (idJugador: string) => {
		if (jugadorPulsado === "" && idJugador !== jugadorPulsado)
			setJugadorPulsado(idJugador);
		else setJugadorPulsado("");
	};

	const [formacion, setFormacion] = useState<Formacion>(props.formacion);
	const [jugadores, setJugadores] = useState<PropiedadJugador[]>(
		props.jugadores
	);
	const [alineacion, setAlineacion] = useState<AlineacionJugador>(
		props.alineacionJugador
	);

	const [jornada, setJornada] = useState<number>(props.jornada);
	const jornadas = Array.from(Array(38).keys());

	const [puntuacionesMap, setPuntuacionesMap] = useState<
		Map<string, PuntuacionJugador[]>
	>(new Map());

	const [arrayPuntuacionesJornada, setArrayPuntuacionesJornada] = useState<
		Map<string, PuntuacionJugador[]>[]
	>(Array());

	const cambiarJornada = (jornada: number) => {
		setLoading(true);
		const prev = arrayPuntuacionesJornada[jornada];
		if (prev === undefined) {
			const map = new Map<string, PuntuacionJugador[]>();
			jugadores.forEach(async (j) => {
				await getPuntuacionJugadorSemana(j.jugador.id, jornada)
					.then((puntuacionSemana) => {
						map.set(j.jugador.id, [puntuacionSemana]);
					})
					.catch((err) => {
						console.log(err);
					});
			});
			let aux = arrayPuntuacionesJornada;
			aux[jornada] = map;
			setArrayPuntuacionesJornada(aux);
			setPuntuacionesMap(map);
			console.log(map);
		} else {
			console.log(arrayPuntuacionesJornada[jornada]);
			setPuntuacionesMap(arrayPuntuacionesJornada[jornada]);
		}

		setJornada(jornada);
		const alineacion = props.plantilla.alineacionesJornada[jornada - 1];
		setAlineacion(alineacion);

		const ju = [];
		ju.push(...alineacion.porteros);
		ju.push(...alineacion.defensas);
		ju.push(...alineacion.medios);
		ju.push(...alineacion.delanteros);
		setJugadores(ju);

		setLoading(false);
	};

	useEffect(() => {
		cambiarJornada(props.jornada);
	}, []);

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
											<IonCol>
												<IonList>
													<IonSelect
														value={jornada}
														interface="popover"
														onIonChange={(e) => {
															cambiarJornada(e.detail.value);
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
												setJugadorPulsado={cambiarJugadorSiOSi}
												alineacion={alineacion}
												formacion={formacion}
												jornada={jornada}
												puntuacionesMap={puntuacionesMap}
											/>
										</IonRow>
									</IonCol>
									<IonCol sizeSm="5" sizeXs="12" style={{ height: "100%" }}>
										<IonContent>
											{jugadorPulsado === "" ? (
												<ListaJugadoresPuntuaciones
													alineacion={alineacion}
													setJugadorPulsado={cambiarJugador}
													jornada={jornada}
													puntuacionesMap={puntuacionesMap}
												/>
											) : (
												<>
													<CartaDetallesPuntuacionJugador
														propiedadJugador={jugadores.find(
															(j) => j.jugador.id === jugadorPulsado
														)}
														showPuntuaciones={true}
														setJugadorPulsado={cambiarJugador}
														jornada={jornada}
														puntuacionesJugador={puntuacionesMap}
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
				<VolverAlInicio />
			)}
		</>
	);
}
