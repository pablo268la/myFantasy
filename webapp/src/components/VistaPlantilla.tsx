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
	IonTitle,
	IonToolbar
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getJugadorById, getPlantilla } from "../endpoints/userEndpoints";
import {
	Jugador,
	JugadorTitular,
	PlantillaUsuario
} from "../shared/sharedTypes";
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
	const [cambioAlineacion, setCambioAlineacion] = useState<boolean>(false);

	const [jugadores, setJugadores] = useState<JugadorTitular[]>([]);
	const [porteros, setPorteros] = useState<JugadorTitular[]>([]);
	const [defensas, setDefensas] = useState<JugadorTitular[]>([]);
	const [mediocentros, setMediocentros] = useState<JugadorTitular[]>([]);
	const [delanteros, setDelanteros] = useState<JugadorTitular[]>([]);

	const [loading, setLoading] = useState<boolean>(false);

	const cambiarJugador = (idJugador: string) => {
		if (idJugador === jugadorPulsado) setJugadorPulsado("");
		else setJugadorPulsado(idJugador);
	};

	const getJugadoresAPI = async () => {
		await getPlantilla().then(async (res) => {
			setPlantilla(res[0]);
			setFormacion({
				portero: 1,
				defensa: Number(res[0].alineacionJugador.formacion.split("-")[0]),
				medio: Number(res[0].alineacionJugador.formacion.split("-")[1]),
				delantero: Number(res[0].alineacionJugador.formacion.split("-")[2]),
			});

			let ju: JugadorTitular[] = [];
			let po: JugadorTitular[] = [];
			let de: JugadorTitular[] = [];
			let me: JugadorTitular[] = [];
			let dl: JugadorTitular[] = [];

			res[0].alineacionJugador.defensas.forEach(async (tupple) => {
				let j = await getJugadorById(tupple.idJugador);
				de.push({ jugador: j, titular: tupple.enPlantilla });
				ju.push({ jugador: j, titular: tupple.enPlantilla });
				de.sort(ordenarListaJugadoresPorTitular());
				setDefensas(de);
			});
			res[0].alineacionJugador.medios.forEach(async (tupple) => {
				let j = await getJugadorById(tupple.idJugador);
				me.push({ jugador: j, titular: tupple.enPlantilla });
				ju.push({ jugador: j, titular: tupple.enPlantilla });
				me.sort(ordenarListaJugadoresPorTitular());
				setMediocentros(me);
			});
			res[0].alineacionJugador.delanteros.forEach(async (tupple) => {
				let j = await getJugadorById(tupple.idJugador);
				dl.push({ jugador: j, titular: tupple.enPlantilla });
				ju.push({ jugador: j, titular: tupple.enPlantilla });
				dl.sort(ordenarListaJugadoresPorTitular());
				setDelanteros(dl);
			});
			res[0].alineacionJugador.porteros.forEach(async (tupple) => {
				let j = await getJugadorById(tupple.idJugador);
				po.push({ jugador: j, titular: tupple.enPlantilla });

				ju.push({ jugador: j, titular: tupple.enPlantilla });
				po.sort(ordenarListaJugadoresPorTitular());
				setPorteros(po);
			});
			setJugadores(ju);
			setLoading(true);
			await new Promise((f) => setTimeout(f, 2000));
			setLoading(false);
		});
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
	};

	const cambiarTitulares = (
		lista: JugadorTitular[],
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
						<IonCol>
						{!loading ? (
							
								<><div style={{ width: 650 }}>
									<IonRow style={{ justifyContent: "space-between" }}>
										<IonList style={{ width: 200 }}>
											<IonSelect
												interface="popover"
												placeholder={formacion.defensa +
													"-" +
													formacion.medio +
													"-" +
													formacion.delantero}
												onIonChange={(e) => {
													let f: Formacion = {
														portero: 1,
														defensa: Number(e.detail.value.split("-")[0]),
														medio: Number(e.detail.value.split("-")[1]),
														delantero: Number(e.detail.value.split("-")[2]),
													};
													cambiarFormacion(f);
												} }
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
											<IonButton>Guardar cambios</IonButton>
										) : (
											<></>
										)}
									</IonRow>
								</div><IonRow>
										<div
											style={{
												width: 650,
												height: 600,
												backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/225px-Soccer_Field_Transparant.svg.png)",
												backgroundSize: "cover",
												marginBottom: 25,
											}}
										>
											<Alineacion
												formacion={formacion}
												setJugadorPulsado={cambiarJugador}
												porteros={porteros}
												defensas={defensas}
												mediocentros={mediocentros}
												delanteros={delanteros} />
										</div>

										<div style={{ width: 540, height: 600, marginLeft: "1%" }}>
											{jugadorPulsado === "" ? (
												<ListaJugadores
													porteros={porteros}
													defensas={defensas}
													mediocentros={mediocentros}
													delanteros={delanteros}
													formacion={formacion}
													cambiarTitulares={cambiarTitulares} />
											) : (
												<>
													<CartaDetallesJugador
														jugador={jugadores.find(
															(j) => j.jugador._id === jugadorPulsado
														)}
														esParaCambio={true}
														posicion={jugadorPulsado}
														porteros={porteros}
														defensas={defensas}
														mediocentros={mediocentros}
														delanteros={delanteros}
														formacion={formacion}
														cambiarTitulares={cambiarTitulares} />
												</>
											)}
										</div>
									</IonRow></>
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
	a: JugadorTitular,
	b: JugadorTitular
) => number {
	return (a, b) => {
		if (a.titular && b.titular) return 0;
		if (a.titular) return -1;
		if (b.titular) return 1;
		return 0;
	};
}
