import {
	IonContent,
	IonHeader,
	IonLabel,
	IonList,
	IonPage,
	IonRow,
	useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getLiga } from "../../endpoints/ligasEndpoints";
import { resetMercado } from "../../endpoints/mercadoEndpoints";
import {
	getLocalLigaSeleccionada,
	getUsuarioLogueado,
	ponerPuntosAValor,
} from "../../helpers/helpers";
import { Liga, Venta } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { CartaJugadorMercado } from "./CartaJugadorMercado";

export function VistaMercado(props: any): JSX.Element {
	const [alert] = useIonAlert();

	const [liga, setLiga] = useState<Liga>();
	const [jugadoresEnMercado, setJugadoresEnMercado] = useState<Venta[]>([]);

	const [reseteandoMercado, setReseteandoMercado] = useState<boolean>(false);

	useEffect(() => {
		const idLiga = getLocalLigaSeleccionada() as string;
		getLiga(idLiga)
			.then((liga) => {
				setLiga(liga);
				setJugadoresEnMercado(liga.mercado);
			})
			.catch((err) => {
				alert(err);
			});
	}, []);

	const resetMercadoFromAPI = () => {
		if (!reseteandoMercado) {
			setReseteandoMercado(true);
			resetMercado(liga as Liga)
				.then((liga) => {
					setLiga(liga);
					setJugadoresEnMercado(liga.mercado);
					setReseteandoMercado(false);
				})
				.catch((err) => {
					alert(err);
				});
		}
	};

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonContent>
					<IonRow>
						<IonLabel>
							Saldo:{" "}
							{ponerPuntosAValor(
								liga?.plantillasUsuarios
									.filter((p) => p.usuario.id === getUsuarioLogueado()?.id)
									.at(0)?.dinero as number
							)}
						</IonLabel>
					</IonRow>
					<IonList>
						{jugadoresEnMercado.map((jugadorEnVenta) => (
							<CartaJugadorMercado
								key={jugadorEnVenta.jugador.jugador._id}
								jugadorEnVenta={jugadorEnVenta}
								idLiga={liga?._id as string}
								resetMercado={resetMercadoFromAPI}
								reseteandoMercado={reseteandoMercado}
							/>
						))}
					</IonList>
				</IonContent>
			</IonPage>
		</>
	);
}
