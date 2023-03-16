import {
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonSegment,
	IonSegmentButton,
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
import { Liga, PropiedadJugador } from "../../shared/sharedTypes";
import { FantasyToolbar } from "../comunes/FantasyToolbar";
import { MenuLateral } from "../comunes/MenuLateral";
import { CartaJugadorMercado } from "./CartaJugadorMercado";
import { CartaVenta } from "./CartaVenta";

export function VistaMercado(props: any): JSX.Element {
	const [alert] = useIonAlert();

	const [liga, setLiga] = useState<Liga>();
	const [jugadoresEnMercado, setJugadoresEnMercado] = useState<
		PropiedadJugador[]
	>([]);

	const [reseteandoMercado, setReseteandoMercado] = useState<boolean>(false);

	const [selectedSegment, setSelectedSegment] = useState<"mercado" | "ofertas">(
		"mercado"
	);

	const actualizarMercado = () => {
		getLiga(getLocalLigaSeleccionada())
			.then((liga) => {
				setLiga(liga);
				setJugadoresEnMercado(liga.mercado);
			})
			.catch((err) => {
				alert(err);
			});
	};

	useEffect(() => {
		actualizarMercado();
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
					<IonSegment color={"primary"} value={selectedSegment}>
						<IonSegmentButton
							value="mercado"
							onClick={() => {
								setSelectedSegment("mercado");
							}}
						>
							<IonLabel>Mercado</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton
							value="ofertas"
							onClick={() => {
								setSelectedSegment("ofertas");
							}}
						>
							<IonLabel>Ofertas</IonLabel>
						</IonSegmentButton>
					</IonSegment>
					{selectedSegment === "mercado" ? (
						<>
							<IonItem color="primary">
								<IonLabel>
									Saldo:{" "}
									{ponerPuntosAValor(
										liga?.plantillasUsuarios
											.filter((p) => p.usuario.id === getUsuarioLogueado()?.id)
											.at(0)?.dinero as number
									)}
								</IonLabel>
							</IonItem>
							<IonList>
								{jugadoresEnMercado.map((jugadorEnVenta) => (
									<CartaJugadorMercado
										key={jugadorEnVenta.jugador._id}
										propiedadJugadorEnVenta={jugadorEnVenta}
										idLiga={liga?._id as string}
										resetMercado={resetMercadoFromAPI}
										reseteandoMercado={reseteandoMercado}
									/>
								))}
							</IonList>
						</>
					) : (
						<>
							<IonItem lines="none">
								<IonLabel>Compras:</IonLabel>
							</IonItem>
							<IonList>
								{jugadoresEnMercado
									.filter((j) => {
										return (
											j.venta.ofertas
												.map((o) => o.comprador.id)
												.indexOf(getUsuarioLogueado()?.id as string) !== -1
										);
									})
									.map((jugadorEnVenta) => (
										<CartaJugadorMercado
											key={jugadorEnVenta.jugador._id}
											propiedadJugadorEnVenta={jugadorEnVenta}
											idLiga={liga?._id as string}
											resetMercado={resetMercadoFromAPI}
											reseteandoMercado={reseteandoMercado}
										/>
									))}
							</IonList>
							<IonItem lines="none">
								<IonLabel>Ventas:</IonLabel>
							</IonItem>
							<IonList>
								{jugadoresEnMercado
									.filter((j) => {
										return (
											j.usuario.id === (getUsuarioLogueado()?.id as string)
										);
									})
									.map((jugadorEnVenta) => (
										<CartaVenta
											key={jugadorEnVenta.jugador._id}
											propiedadJugadorEnVenta={jugadorEnVenta}
											idLiga={liga?._id as string}
											actualizarMercado={actualizarMercado}
										/>
									))}
							</IonList>
						</>
					)}
				</IonContent>
			</IonPage>
		</>
	);
}
