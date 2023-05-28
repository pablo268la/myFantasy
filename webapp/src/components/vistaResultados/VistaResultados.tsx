import {
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonProgressBar,
    IonRow,
    IonSelect,
    IonSelectOption,
    useIonToast,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { getPartidosByJornada } from "../../endpoints/partidosEndpoint";
import { Partido } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { Resultados } from "./Resultado";

export function VistaResultados(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);

	const [jornada, setJornada] = useState<number>(1);
	const [partidos, setPartidos] = useState<Partido[]>([]);

	const jornadas = Array.from(Array(38).keys());

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const getPartidosDeJornada = async (jornada: number) => {
		setLoading(true);
		setJornada(jornada);
		await getPartidosByJornada(jornada)
			.then((partidos) => {
				setPartidos(partidos);
			})
			.catch((err) => {
				crearToast(err.message, true, "danger");
			});
		setLoading(false);
	};

	useEffect(() => {
		getPartidosDeJornada(jornada).catch((err) => {
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
				<IonContent>
					<IonRow className="ion-justify-content-center">
						<h1>Resultados</h1>
					</IonRow>
					<IonSelect
						value={jornada}
						onIonChange={async (e) => {
							await getPartidosDeJornada(e.detail.value);
						}}
					>
						{jornadas.map((jornada) => (
							<IonSelectOption key={jornada + 1} value={jornada + 1}>
								Jornada {jornada + 1}
							</IonSelectOption>
						))}
					</IonSelect>

					{!loading ? (
						<>
							<IonList>
								{partidos.map((partido) => (
									<Resultados partido={partido} />
								))}
							</IonList>
						</>
					) : (
						<>
							<IonProgressBar type="indeterminate" />
						</>
					)}
				</IonContent>
			</IonPage>
		</>
	);
}
