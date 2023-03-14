import {
	IonContent,
	IonHeader,
	IonPage,
	IonProgressBar,
	IonSegment,
	IonSegmentButton,
	useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
	getPlantilla,
	updatePlantillaUsuario,
} from "../../endpoints/plantillaEndpoints";

import {
	getLocalLigaSeleccionada,
	getUsuarioLogueado,
} from "../../helpers/helpers";
import {
	AlineacionJugador,
	Jugador,
	PlantillaUsuario,
	PropiedadJugador,
} from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { VistaPlantillaNormal } from "./vistaPlantillaNormal/VistaPlantillaNormal";
import { VistaPuntauciones as VistaPuntuaciones } from "./vistaPuntuaciones/VistaPuntuaciones";

export type Formacion = {
	portero: number;
	defensa: number;
	medio: number;
	delantero: number;
};

type PlantillaProps = {};

function VistaPlantilla(props: PlantillaProps): JSX.Element {
	const nav = useIonRouter();
	const idPlantillaUsuario: string = window.location.pathname.split("/")[2];
	const idLiga: string = getLocalLigaSeleccionada() as string;
	const sameUsuario: boolean = idPlantillaUsuario === getUsuarioLogueado()?.id;

	const [segment, setSegment] = useState<"plantilla" | "alineacion">(
		"plantilla"
	);

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

	const [jornada, setJornada] = useState<number>(1);

	const getJugadoresAPI = async () => {
		setLoading(true);
		await getPlantilla(idLiga, idPlantillaUsuario)
			.then(async (res) => {
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
			})
			.catch((err) => {
				console.log(err);
				nav.push("/ligas", "forward");
			});
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
			dinero: plantilla?.dinero as number,
		};

		setPlantilla(await updatePlantillaUsuario(plantillaUsuario, idLiga));
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
				{!loading ? (
					<>
						<IonSegment value={segment}>
							<IonSegmentButton
								value="plantilla"
								onClick={() => {
									setSegment("plantilla");
								}}
							>
								Plantilla
							</IonSegmentButton>
							<IonSegmentButton
								value="alineacion"
								onClick={() => {
									setSegment("alineacion");
								}}
							>
								Alineacion
							</IonSegmentButton>
						</IonSegment>
						{segment === "plantilla" ? (
							<>
								<VistaPlantillaNormal
									plantilla={plantilla as PlantillaUsuario}
									jugadores={jugadores}
									porteros={porteros}
									defensas={defensas}
									mediocentros={mediocentros}
									delanteros={delanteros}
									jornada={jornada}
									setJornada={setJornada}
									formacion={formacion}
									cambiarFormacion={cambiarFormacion}
									jugadorPulsado={jugadorPulsado}
									setJugadorPulsado={setJugadorPulsado}
									cambiarTitulares={cambiarTitulares}
									cambioAlineacion={cambioAlineacion}
									guardarPlantilla={guardarPlantilla}
									setValueFormacion={setValueFormacion}
								/>
							</>
						) : (
							<>
								<VistaPuntuaciones
									plantilla={plantilla as PlantillaUsuario}
									formacion={formacion}
									jugadores={jugadores}
									porteros={porteros}
									defensas={defensas}
									mediocentros={mediocentros}
									delanteros={delanteros}
									setJornada={setJornada}
									jornada={jornada}
								/>
							</>
						)}
					</>
				) : (
					<IonContent>
						<IonProgressBar type="indeterminate"></IonProgressBar>
					</IonContent>
				)}
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
