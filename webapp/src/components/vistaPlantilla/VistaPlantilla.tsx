import {
	IonButton,
	IonCol,
	IonContent,
	IonHeader,
	IonList,
	IonPage,
	IonProgressBar,
	IonRow,
	IonSelect,
	IonSelectOption,
	useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
	getPlantilla,
	updatePlantillaUsuario,
} from "../../endpoints/plantillaEndpoints";

import { getUsuarioLogueado } from "../../helpers/helpers";
import {
	AlineacionJugador,
	Jugador,
	PlantillaUsuario,
	PropiedadJugador,
} from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { Alineacion } from "./Alineacion";
import { CartaDetallesJugador } from "./CartaDetallesJugador";
import { ListaJugadores } from "./ListaJugadores";

export type Formacion = {
	portero: number;
	defensa: number;
	medio: number;
	delantero: number;
};

type PlantillaProps = {};

function VistaPlantilla(props: PlantillaProps): JSX.Element {
	const nav = useIonRouter();

	const [plantilla, setPlantilla] = useState<PlantillaUsuario>();
	const [formacion, setFormacion] = useState<Formacion>({
		portero: 1,
		defensa: 4,
		medio: 3,
		delantero: 3,
	});
	const [valueFormacion, setValueFormacion] = useState<string>();
	const [jugadorPulsado, setJugadorPulsado] = useState<string>("");
	const [cambioAlineacion, setCambioAlineacion] = useState<boolean>(false);

	const [jugadores, setJugadores] = useState<PropiedadJugador[]>([]);
	const [porteros, setPorteros] = useState<PropiedadJugador[]>([]);
	const [defensas, setDefensas] = useState<PropiedadJugador[]>([]);
	const [mediocentros, setMediocentros] = useState<PropiedadJugador[]>([]);
	const [delanteros, setDelanteros] = useState<PropiedadJugador[]>([]);

	const [loading, setLoading] = useState<boolean>(false);
	const [idLiga, setIdLiga] = useState<string>(
		window.location.pathname.split("/")[2]
	);
	const [idPlantillaUsuario, setIdPlantillaUsuario] = useState<string>(
		window.location.pathname.split("/")[3]
	);

	const [sameUsuario, setSameUsuario] = useState<boolean>(
		idPlantillaUsuario === getUsuarioLogueado()?.id
	);

	const cambiarJugador = (idJugador: string) => {
		if (idJugador === jugadorPulsado) setJugadorPulsado("");
		else setJugadorPulsado(idJugador);
	};

	const getJugadoresAPI = async () => {
		setLoading(true);
		await getPlantilla(idLiga, window.location.pathname.split("/")[3]).then(
			async (res) => {
				setPlantilla(res);
				setFormacion({
					portero: 1,
					defensa: Number(res.alineacionJugador.formacion.split("-")[0]),
					medio: Number(res.alineacionJugador.formacion.split("-")[1]),
					delantero: Number(res.alineacionJugador.formacion.split("-")[2]),
				});
				setValueFormacion(res.alineacionJugador.formacion);

				let ju: PropiedadJugador[] = [];
				let po: PropiedadJugador[] = res.alineacionJugador.porteros;
				let de: PropiedadJugador[] = res.alineacionJugador.defensas;
				let me: PropiedadJugador[] = res.alineacionJugador.medios;
				let dl: PropiedadJugador[] = res.alineacionJugador.delanteros;

				po.sort(ordenarListaJugadoresPorTitular());
				setPorteros(po);
				de.sort(ordenarListaJugadoresPorTitular());
				setDefensas(de);
				me.sort(ordenarListaJugadoresPorTitular());
				setMediocentros(me);
				dl.sort(ordenarListaJugadoresPorTitular());
				setDelanteros(dl);

				ju.push(...po);
				ju.push(...de);
				ju.push(...me);
				ju.push(...dl);

				setJugadores(ju);
				await new Promise((f) => setTimeout(f, 2000));
			}
		);
		setLoading(false);
	};

	const cambiarFormacion = (f: Formacion) => {
		setFormacion(f);
		defensas
			.slice(0, f.defensa)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = true;
			});
		defensas
			.slice(f.defensa)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = false;
			});
		setDefensas(defensas);

		mediocentros
			.slice(0, f.medio)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = true;
			});
		mediocentros
			.slice(f.medio)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = false;
			});
		setMediocentros(mediocentros);

		delanteros
			.slice(0, f.delantero)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = true;
			});
		delanteros
			.slice(f.delantero)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = false;
			});
		setDelanteros(delanteros);
		setCambioAlineacion(true);
	};

	const cambiarTitulares = (
		lista: PropiedadJugador[],
		idIn: string,
		idOut: string
	) => {
		let jin = lista.find((j) => j.jugador._id === idIn);
		let jout = lista.find((j) => j.jugador._id === idOut);
		if (jin) {
			jin.titular = !jin.titular;
		}
		if (jout) {
			jout.titular = !jout.titular;
		}

		switch (lista[0].jugador.posicion) {
			case "Portero":
				setPorteros(lista.sort(ordenarListaJugadoresPorTitular()));
				break;
			case "Defensa":
				setDefensas(lista.sort(ordenarListaJugadoresPorTitular()));
				break;
			case "Mediocentro":
				setMediocentros(lista.sort(ordenarListaJugadoresPorTitular()));
				break;
			case "Delantero":
				setDelanteros(lista.sort(ordenarListaJugadoresPorTitular()));
				break;
		}

		setJugadorPulsado("");
		setCambioAlineacion(true);
	};

	const guardarPlantilla = async () => {
		const alineacionJugador: AlineacionJugador = {
			_id: plantilla?.alineacionJugador._id as string,
			porteros: porteros,
			defensas: defensas,
			medios: mediocentros,
			delanteros: delanteros,
			formacion: valueFormacion as string,
			guardadoEn: new Date().toISOString(),
			idLiga: plantilla?.alineacionJugador.idLiga as string,
		};
		const plantillaUsuario: PlantillaUsuario = {
			_id: plantilla?._id as string,
			usuario: plantilla?.usuario as any,
			idLiga: plantilla?.idLiga as string,
			alineacionJugador: alineacionJugador,
			alineacionesJornada: plantilla?.alineacionesJornada as any,
			puntos: plantilla?.puntos as number,
			valor: plantilla?.valor as number,
		};

		setPlantilla(await updatePlantillaUsuario(plantillaUsuario));
		setCambioAlineacion(false);
	};

	useEffect(() => {
		getJugadoresAPI();
	}, []);

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonContent>
					<IonRow>
						<IonCol>
							{!loading ? (
								<>
									<div style={{ maxWidth: 650, width: "100%" }}>
										<IonRow style={{ justifyContent: "space-between" }}>
											<IonList style={{ width: 200 }}>
												<IonSelect
													interface="popover"
													placeholder={
														formacion.defensa +
														"-" +
														formacion.medio +
														"-" +
														formacion.delantero
													}
													onIonChange={(e) => {
														let f: Formacion = {
															portero: 1,
															defensa: Number(e.detail.value.split("-")[0]),
															medio: Number(e.detail.value.split("-")[1]),
															delantero: Number(e.detail.value.split("-")[2]),
														};
														setValueFormacion(e.detail.value);
														cambiarFormacion(f);
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
											{cambioAlineacion ? (
												<IonButton onClick={() => guardarPlantilla()}>
													Guardar cambios
												</IonButton>
											) : (
												<></>
											)}
										</IonRow>
									</div>
									<IonRow style={{ height: "100%" }}>
										<div
											style={{
												width: 650,
												height: 600,
												backgroundImage:
													"url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/225px-Soccer_Field_Transparant.svg.png)",
												backgroundSize: "cover",
												marginBottom: "5%",
											}}
										>
											<Alineacion
												usuario={plantilla?.usuario}
												formacion={formacion}
												setJugadorPulsado={cambiarJugador}
												porteros={porteros}
												defensas={defensas}
												mediocentros={mediocentros}
												delanteros={delanteros}
											/>
										</div>

										<div
											style={{
												width: 540,
												height: "100%",
												marginLeft: "1%",
												marginBottom: "5%",
											}}
										>
											{jugadorPulsado === "" ? (
												<IonContent>
													<ListaJugadores
														porteros={porteros}
														defensas={defensas}
														mediocentros={mediocentros}
														delanteros={delanteros}
														formacion={formacion}
														cambiarTitulares={cambiarTitulares}
														isSameUser={sameUsuario}
													/>
												</IonContent>
											) : (
												<>
													<CartaDetallesJugador
														propiedadJugador={jugadores.find(
															(j) => j.jugador._id === jugadorPulsado
														)}
														esParaCambio={true}
														posicion={jugadorPulsado}
														porteros={porteros}
														defensas={defensas}
														mediocentros={mediocentros}
														delanteros={delanteros}
														formacion={formacion}
														cambiarTitulares={cambiarTitulares}
														isSameUser={sameUsuario}
													/>
												</>
											)}
										</div>
									</IonRow>
								</>
							) : (
								<IonProgressBar type="indeterminate"></IonProgressBar>
							)}
						</IonCol>
					</IonRow>
				</IonContent>
			</IonPage>
		</>
	);
}

export function eliminarDuplicados(
	js: Jugador[]
): (value: Jugador, index: number, array: Jugador[]) => unknown {
	return (element, index) => {
		return js.indexOf(element) === index;
	};
}

export function ordenarListaJugadoresPorTitular(): (
	a: PropiedadJugador,
	b: PropiedadJugador
) => number {
	return (a, b) => {
		if (a.titular && b.titular) return 0;
		if (a.titular) return -1;
		if (b.titular) return 1;
		return 0;
	};
}

export default VistaPlantilla;
