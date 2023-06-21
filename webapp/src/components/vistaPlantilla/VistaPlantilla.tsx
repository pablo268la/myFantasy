import {
	IonContent,
	IonHeader,
	IonLoading,
	IonPage,
	IonProgressBar,
	IonSegment,
	IonSegmentButton,
	useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
	getPlantilla,
	updatePlantillaUsuario,
} from "../../endpoints/plantillaEndpoints";

import { getJornadaActual } from "../../endpoints/partidosEndpoint";
import { getLocalLigaSeleccionada } from "../../helpers/helpers";
import {
	AlineacionJugador,
	Jugador,
	PlantillaUsuario,
	PropiedadJugador,
} from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { VistaPlantillaNormal } from "./vistaPlantillaNormal/VistaPlantillaNormal";
import { VistaPuntuaciones } from "./vistaPuntuaciones/VistaPuntuaciones";

export type Formacion = {
	portero: number;
	defensa: number;
	medio: number;
	delantero: number;
};

type PlantillaProps = {};

function VistaPlantilla(props: PlantillaProps): JSX.Element {
	const idPlantillaUsuario: string = window.location.pathname.split("/")[2];
	const idLiga: string = getLocalLigaSeleccionada();

	const [segment, setSegment] = useState<"plantilla" | "puntuaciones">(
		"plantilla"
	);

	const [plantilla, setPlantilla] = useState<PlantillaUsuario>();
	const [formacion, setFormacion] = useState<Formacion>({
		portero: 1,
		defensa: 4,
		medio: 3,
		delantero: 3,
	});
	const [jugadorPulsado, setJugadorPulsado] = useState<string>("");
	const [cambioAlineacion, setCambioAlineacion] = useState<boolean>(false);

	const [jugadores, setJugadores] = useState<PropiedadJugador[]>([]);

	const [alineacionJugador, setAlineacionJugador] =
		useState<AlineacionJugador>();

	const [loading, setLoading] = useState<boolean>(false);
	const [jornada, setJornada] = useState<number>(0);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const [showLoading, setShowLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");

	const getJugadoresAPI = async () => {
		setLoading(true);
		await getPlantilla(idLiga, idPlantillaUsuario)
			.then((res) => {
				setPlantilla(res);

				const alineacion = res.alineacionJugador;

				setFormacion({
					portero: 1,
					defensa: Number(res.alineacionJugador.formacion.split("-")[0]),
					medio: Number(res.alineacionJugador.formacion.split("-")[1]),
					delantero: Number(res.alineacionJugador.formacion.split("-")[2]),
				});

				let ju: PropiedadJugador[] = [];
				let po: PropiedadJugador[] = res.alineacionJugador.porteros;
				let de: PropiedadJugador[] = res.alineacionJugador.defensas;
				let me: PropiedadJugador[] = res.alineacionJugador.medios;
				let dl: PropiedadJugador[] = res.alineacionJugador.delanteros;

				po.sort(ordenarListaJugadoresPorTitular());
				de.sort(ordenarListaJugadoresPorTitular());
				me.sort(ordenarListaJugadoresPorTitular());
				dl.sort(ordenarListaJugadoresPorTitular());

				ju.push(...po);
				ju.push(...de);
				ju.push(...me);
				ju.push(...dl);

				alineacion.porteros = po;
				alineacion.defensas = de;
				alineacion.medios = me;
				alineacion.delanteros = dl;

				setAlineacionJugador(alineacion);

				setJugadores(ju);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				crearToast(err.message, true, "danger");
			});
	};

	const cambiarFormacion = (f: Formacion) => {
		setFormacion(f);
		const alineacion = alineacionJugador as AlineacionJugador;
		alineacion.defensas
			.slice(0, f.defensa)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = true;
			});
		alineacion.defensas
			.slice(f.defensa)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = false;
			});

		alineacion.medios
			.slice(0, f.medio)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = true;
			});
		alineacion.medios
			.slice(f.medio)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = false;
			});

		alineacion.delanteros
			.slice(0, f.delantero)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = true;
			});
		alineacion.delanteros
			.slice(f.delantero)
			.filter((j) => j.titular)
			.forEach((j) => {
				j.titular = false;
			});
		alineacion.formacion = `${f.defensa}-${f.medio}-${f.delantero}`;
		setAlineacionJugador(alineacion);
		setCambioAlineacion(true);
	};

	const cambiarTitulares = (
		lista: PropiedadJugador[],
		idIn: string,
		idOut: string
	) => {
		let jin = lista.find((j) => j.jugador.id === idIn);
		let jout = lista.find((j) => j.jugador.id === idOut);
		if (jin) {
			jin.titular = !jin.titular;
		}
		if (jout) {
			jout.titular = !jout.titular;
		}

		const alineacion = alineacionJugador as AlineacionJugador;

		switch (lista[0].jugador.posicion) {
			case "Portero":
				alineacion.porteros = lista.sort(ordenarListaJugadoresPorTitular());
				break;
			case "Defensa":
				alineacion.defensas = lista.sort(ordenarListaJugadoresPorTitular());
				break;
			case "Mediocentro":
				alineacion.medios = lista.sort(ordenarListaJugadoresPorTitular());
				break;
			case "Delantero":
				alineacion.delanteros = lista.sort(ordenarListaJugadoresPorTitular());
				break;
		}

		setJugadorPulsado("");
		setAlineacionJugador(alineacion);
		setCambioAlineacion(true);
	};

	const guardarPlantilla = async () => {
		setShowLoading(true);
		const auxAli = alineacionJugador as AlineacionJugador;
		auxAli.guardadoEn = new Date().toISOString();
		auxAli.porteros = auxAli.porteros.filter((j) => j.jugador.id !== "empty");
		auxAli.defensas = auxAli.defensas.filter((j) => j.jugador.id !== "empty");
		auxAli.medios = auxAli.medios.filter((j) => j.jugador.id !== "empty");
		auxAli.delanteros = auxAli.delanteros.filter(
			(j) => j.jugador.id !== "empty"
		);
		const plantillaUsuario: PlantillaUsuario = {
			id: plantilla?.id as string,
			usuario: plantilla?.usuario as any,
			idLiga: plantilla?.idLiga as string,
			alineacionJugador: auxAli,
			alineacionesJornada: plantilla?.alineacionesJornada as any,
			puntos: plantilla?.puntos as number,
			valor: plantilla?.valor as number,
			dinero: plantilla?.dinero as number,
		};

		await updatePlantillaUsuario(plantillaUsuario, idLiga)
			.then((res) => {
				setPlantilla(res);
				setShowLoading(false);
				crearToast("Plantilla guardada", true, "success");
			})
			.catch((err) => {
				setShowLoading(false);
				crearToast(err.message, true, "danger");
			});

		setCambioAlineacion(false);
	};

	useEffect(() => {
		getJornadaActual()
			.then((j) => {
				setJornada(j);
			})
			.catch((err) => {
				crearToast(err.message, true, "danger");
			});
		getJugadoresAPI().catch((err) => {
			crearToast(err.message, true, "danger");
		});
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
						<IonLoading isOpen={showLoading} message={message} />
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
								value="puntuaciones"
								onClick={() => {
									setSegment("puntuaciones");
								}}
							>
								Puntuaciones
							</IonSegmentButton>
						</IonSegment>
						{segment === "plantilla" ? (
							<>
								<VistaPlantillaNormal
									plantilla={plantilla as PlantillaUsuario}
									jugadores={jugadores}
									alineacion={alineacionJugador as AlineacionJugador}
									formacion={formacion}
									cambiarFormacion={cambiarFormacion}
									jugadorPulsado={jugadorPulsado}
									setJugadorPulsado={setJugadorPulsado}
									cambiarTitulares={cambiarTitulares}
									cambioAlineacion={cambioAlineacion}
									guardarPlantilla={guardarPlantilla}
									setShowLoading={setShowLoading}
									setMessage={setMessage}
									crearToast={crearToast}
									jornada={jornada}
								/>
							</>
						) : (
							<>
								<VistaPuntuaciones
									plantilla={plantilla as PlantillaUsuario}
									formacion={formacion}
									jugadores={jugadores}
									alineacionJugador={alineacionJugador as AlineacionJugador}
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
