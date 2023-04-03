import {
    IonCol,
    IonGrid,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonRow,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getJugadoresPorEquipo } from "../../endpoints/jugadorEndpoints";
import { getPartidosByJornada } from "../../endpoints/partidosController";
import { Jugador, Partido } from "../../shared/sharedTypes";
import { PartidosLista } from "./PartidosLista";

export function VistaAdminPartidos(props: any): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("Analizando el Big Data");

	const [jornada, setJornada] = useState<number>(1);
	const [partidos, setPartidos] = useState<Partido[]>([]);
	const [partido, setPartido] = useState<string>();
	const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido>();

	const jornadas = Array.from(Array(38).keys());

	const [jugadoresLocales, setJugadoresLocales] = useState<Jugador[]>([]);
	const [jugadoresVisitantes, setJugadoresVisitantes] = useState<Jugador[]>([]);

	const getPartidosDeJornada = async (jornada: number) => {
		setLoading(true);
		setJornada(jornada);
		await getPartidosByJornada(jornada).then((partidos) => {
			setPartidos(partidos);
		});
		setLoading(false);
	};

	const changeSelectedPartido = async (partido: any) => {
		setLoading(true);
		setPartido(partido);
		if (partido === undefined) setPartidoSeleccionado(undefined);
		else {
			const p = partidos.filter((p) => p._id === partido).at(0);
			if (p) {
				setPartidoSeleccionado(p);
				getJugadoresPorEquipo(p.local._id).then((jugadores) =>
					setJugadoresLocales(jugadores)
				);
				getJugadoresPorEquipo(p.visitante._id).then((jugadores) =>
					setJugadoresVisitantes(jugadores)
				);
			} else setPartidoSeleccionado(undefined);
		}
		setLoading(false);
	};

	useEffect(() => {
		getPartidosDeJornada(jornada);
	}, []);

	return (
		<>
			<IonGrid>
				<IonRow>
					<IonLoading isOpen={loading} message={message} />
					<IonCol sizeSm="6" sizeXs="12">
						<IonRow>
							<IonCol size="6">
								<IonSelect
									value={jornada}
									onIonChange={(e) => {
										setMessage("Analizando el Big Data");
										getPartidosDeJornada(e.detail.value);
										changeSelectedPartido(undefined);
									}}
								>
									{jornadas.map((jornada) => (
										<IonSelectOption key={jornada + 1} value={jornada + 1}>
											Jornada {jornada + 1}
										</IonSelectOption>
									))}
								</IonSelect>
							</IonCol>
							<IonCol size="6">
								{!loading ? (
									<>
										<IonSelect
											placeholder="Selecciona un partido"
											interface="action-sheet"
											onIonChange={async (e) => {
												await changeSelectedPartido(e.detail.value);
												setMessage("Buscando los resumenes");
											}}
										>
											{partidos.map((p) => (
												<IonSelectOption key={p._id} value={p._id}>
													{p.local.nombre} - {p.visitante.nombre}
												</IonSelectOption>
											))}
										</IonSelect>
									</>
								) : (
									<></>
								)}
							</IonCol>
						</IonRow>
					</IonCol>
					<IonCol>
						{partido !== undefined ? (
							<>
								<IonRow>
									<IonCol>
										<IonItem lines="none">
											<IonLabel>Link SofaScore</IonLabel>
											<IonInput
												value={partidoSeleccionado?.linkSofaScore}
											></IonInput>
										</IonItem>
									</IonCol>
								</IonRow>
							</>
						) : (
							<></>
						)}
					</IonCol>
				</IonRow>
			</IonGrid>

			{!loading && partidoSeleccionado !== undefined ? (
				<>
					<IonRow>
						<IonCol>
							<PartidosLista
								partido={partidoSeleccionado}
								jugadores={jugadoresLocales}
								local={true}
							/>
						</IonCol>
						<IonCol>
							<PartidosLista
								partido={partidoSeleccionado}
								jugadores={jugadoresVisitantes}
								local={false}
							/>
						</IonCol>
					</IonRow>
				</>
			) : (
				<></>
			)}
		</>
	);
}
