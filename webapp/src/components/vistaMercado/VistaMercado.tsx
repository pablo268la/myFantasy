import {
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonLoading,
	IonPage,
	IonProgressBar,
	IonRow,
	IonSegment,
	IonSegmentButton,
	useIonToast,
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
	const [liga, setLiga] = useState<Liga>();
	const [jugadoresEnMercado, setJugadoresEnMercado] = useState<
		PropiedadJugador[]
	>([]);

	const [dineroUsuario, setDineroUsuario] = useState<number>(0);
	const [dineroPujasUsuario, setDineroPujasUsuario] = useState<number>(0);

	const [reseteandoMercado, setReseteandoMercado] = useState<boolean>(false);

	const [selectedSegment, setSelectedSegment] = useState<"mercado" | "ofertas">(
		"mercado"
	);

	const [showLoading, setShowLoading] = useState<boolean>(false);
	const [loadingMessage, setLoadingMessage] = useState<string>();

	const [loading, setLoading] = useState<boolean>(false);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const actualizarMercado = async () => {
		setLoading(true);

		await getLiga(getLocalLigaSeleccionada())
			.then((ligaUpdated) => {
				actualizarInfoLigaYMercado(ligaUpdated);
				setLoading(false);
			})
			.catch((err) => {
				crearToast(err.message, true, "danger");
				setLoading(false);
			});
	};

	function actualizarInfoLigaYMercado(ligaUpdated: Liga) {
		setLiga(ligaUpdated);
		setJugadoresEnMercado(ligaUpdated.mercado);
		setDineroUsuario(
			(ligaUpdated.plantillasUsuarios
				.filter((p) => p.usuario.id === getUsuarioLogueado()?.id)
				.at(0)?.dinero as number) ?? 0
		);
		setDineroPujasUsuario(
			(ligaUpdated.mercado
				.map((j) =>
					j.venta.ofertas
						.filter(
							(oferta) => oferta.comprador.id === getUsuarioLogueado()?.id
						)
						.map((oferta) => oferta.valorOferta)
				)
				.map((valor) => valor[0] ?? 0)
				.reduce((a, b) => a + b, 0) as number) ?? 0
		);
	}

	const resetMercadoFromAPI = async () => {
		if (!reseteandoMercado) {
			setReseteandoMercado(true);
			await resetMercado(liga as Liga)
				.then((ligaUpdated) => {
					actualizarInfoLigaYMercado(ligaUpdated);
					setReseteandoMercado(false);
				})
				.catch((err) => {
					setReseteandoMercado(false);
					crearToast(err.message, true, "danger");
				});
		}
	};

	useEffect(() => {
		setLoading(true);
		actualizarMercado()
			.then(() => {
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}, []);

	return (
		<>
			<MenuLateral />
			<IonPage id="main-content">
				<IonHeader>
					<FantasyToolbar />
				</IonHeader>
				<IonLoading isOpen={showLoading} message={loadingMessage} />
				{loading || reseteandoMercado || liga === undefined ? (
					<IonContent>
						<IonProgressBar type="indeterminate"></IonProgressBar>
					</IonContent>
				) : (
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
									<IonRow>
										<IonLabel>
											Saldo: {ponerPuntosAValor(dineroUsuario)}
										</IonLabel>
										<IonLabel color={"danger"} style={{ marginLeft: "10px" }}>
											{"(-"}
											{ponerPuntosAValor(dineroPujasUsuario)}
											{" )"}
										</IonLabel>
									</IonRow>
								</IonItem>
								<IonList>
									{jugadoresEnMercado.map((jugadorEnVenta) => (
										<CartaJugadorMercado
											key={jugadorEnVenta.jugador.id}
											propiedadJugadorEnVenta={jugadorEnVenta}
											idLiga={liga?.id as string}
											resetMercado={resetMercadoFromAPI}
											reseteandoMercado={reseteandoMercado}
											actualizarMercado={actualizarMercado}
											setLoadingMessage={setLoadingMessage}
											setShowLoading={setShowLoading}
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
												key={jugadorEnVenta.jugador.id}
												propiedadJugadorEnVenta={jugadorEnVenta}
												idLiga={liga?.id as string}
												resetMercado={resetMercadoFromAPI}
												reseteandoMercado={reseteandoMercado}
												actualizarMercado={actualizarMercado}
												setLoadingMessage={setLoadingMessage}
												setShowLoading={setShowLoading}
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
												key={jugadorEnVenta.jugador.id}
												propiedadJugadorEnVenta={jugadorEnVenta}
												idLiga={liga?.id as string}
												actualizarMercado={actualizarMercado}
												setLoadingMessage={setLoadingMessage}
												setShowLoading={setShowLoading}
											/>
										))}
								</IonList>
							</>
						)}
					</IonContent>
				)}
			</IonPage>
		</>
	);
}
