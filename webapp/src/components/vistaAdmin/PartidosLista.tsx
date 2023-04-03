import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonModal,
	IonRow,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { addCircleOutline, closeCircleOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { comparePosiciones } from "../../helpers/helpers";
import { Alineacion, Jugador, Partido } from "../../shared/sharedTypes";

type PartidosListaProps = {
	partido: Partido;
	jugadores: Jugador[];
	local: boolean;
	setCambiado: (cambiado: boolean) => void;
	setAlinecion: (alineacion: Alineacion) => void;
};

export function PartidosLista(props: PartidosListaProps): JSX.Element {
	const [partido, setPartido] = useState<Partido>(props.partido);

	const [showModal, setShowModal] = useState<boolean>(false);
	const modal = useRef<HTMLIonModalElement>(null);

	const [todos, setTodos] = useState<Jugador[]>([]);

	const [titulares, setTitulares] = useState<Jugador[]>([]);
	const [supl, setSupl] = useState<Jugador[]>([]);
	const [vacios, setVacios] = useState<any>(Array.from(Array(0)));
	const [vaciosSupl, setVaciosSupl] = useState<any>(Array.from(Array(0)));

	const [forTitular, setForTitular] = useState<boolean>(true);

	const changeTitulares = (newTitulares: Jugador[]) => {
		setTitulares(
			newTitulares.sort((a, b) => comparePosiciones(a.posicion, b.posicion))
		);
		setVacios(Array.from(Array(11 - newTitulares.length)));
		props.setAlinecion({
			jugadoresTitulares: newTitulares,
			jugadoresSuplentes: supl,
		});
	};

	const changeSupl = (newSupl: Jugador[]) => {
		setSupl(newSupl.sort((a, b) => comparePosiciones(a.posicion, b.posicion)));
		setVaciosSupl(Array.from(Array(1)));
		props.setAlinecion({
			jugadoresTitulares: titulares,
			jugadoresSuplentes: newSupl,
		});
	};

	const getJugadoresNiTitularesNiSupl = () => {
		return todos.filter((t) => {
			return (
				!titulares.map((j) => j._id).includes(t._id) &&
				!supl.map((j) => j._id).includes(t._id)
			);
		});
	};

	useEffect(() => {
		setTodos(props.jugadores);
		//TODO - Get jugadores antiguos by jornada
		if (props.local) {
			changeTitulares(props.partido.alineacionLocal.jugadoresTitulares);
			changeSupl(props.partido.alineacionLocal.jugadoresSuplentes);
		} else {
			changeTitulares(props.partido.alineacionVisitante.jugadoresTitulares);
			changeSupl(props.partido.alineacionVisitante.jugadoresSuplentes);
		}
	}, [props.partido, props.jugadores]);

	return (
		<>
			<IonRow style={{ justifyContent: "center" }}>
				<IonLabel>
					{props.local
						? props.partido.local.nombre
						: props.partido.visitante.nombre}
				</IonLabel>
			</IonRow>
			{titulares.map((jugador) => (
				<>
					<IonCard key={"local-titular-" + jugador._id}>
						<IonCardContent>
							<IonItem lines="none">
								<IonLabel>{jugador.nombre}</IonLabel>

								<IonIcon
									size="large"
									icon={closeCircleOutline}
									onClick={() => {
										changeTitulares(
											titulares.filter((j) => j._id !== jugador._id)
										);
										props.setCambiado(true);
									}}
								/>
							</IonItem>
						</IonCardContent>
					</IonCard>
				</>
			))}
			{vacios.map((p: any) => {
				return (
					<>
						<IonCard style={{ outline: "dashed" }}>
							<IonCardContent>
								<IonRow style={{ justifyContent: "center" }}>
									<IonItem lines="none">
										<IonIcon
											size="large"
											icon={addCircleOutline}
											onClick={() => {
												setForTitular(true);
												setShowModal(true);
												props.setCambiado(true);
											}}
										/>
									</IonItem>
								</IonRow>
							</IonCardContent>
						</IonCard>
					</>
				);
			})}

			<IonRow style={{ justifyContent: "center" }}>
				<IonLabel>
					Suplentes{" "}
					{props.local
						? props.partido.local.nombre
						: props.partido.visitante.nombre}
				</IonLabel>
			</IonRow>

			{supl.map((jugador) => (
				<>
					<IonCard key={"local-titular-" + jugador._id}>
						<IonCardContent>
							<IonItem lines="none">
								<IonLabel>{jugador.nombre}</IonLabel>

								<IonIcon
									size="large"
									icon={closeCircleOutline}
									onClick={() => {
										changeSupl(supl.filter((j) => j._id !== jugador._id));
										props.setCambiado(true);
									}}
								/>
							</IonItem>
						</IonCardContent>
					</IonCard>
				</>
			))}
			{vaciosSupl.map((p: any) => {
				return (
					<>
						<IonCard style={{ outline: "dashed" }}>
							<IonCardContent>
								<IonRow style={{ justifyContent: "center" }}>
									<IonItem lines="none">
										<IonIcon
											size="large"
											icon={addCircleOutline}
											onClick={() => {
												setForTitular(false);
												setShowModal(true);
												props.setCambiado(true);
											}}
										/>
									</IonItem>
								</IonRow>
							</IonCardContent>
						</IonCard>
					</>
				);
			})}

			<IonModal
				ref={modal}
				isOpen={showModal}
				onDidDismiss={() => {
					setShowModal(false);
				}}
			>
				<IonHeader>
					<IonToolbar>
						<IonButtons slot="start">
							<IonButton
								onClick={() => {
									modal.current?.dismiss();
								}}
							>
								Cancel
							</IonButton>
						</IonButtons>
						<IonTitle>
							<IonRow className="ion-justify-content-center">
								Jugadores {props.partido.local.nombre}
							</IonRow>
						</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<>
						{OrdenarPorPosiciones(
							getJugadoresNiTitularesNiSupl(),
							(jugador: Jugador) => {
								if (forTitular) {
									const a = titulares;
									a.push(jugador);
									changeTitulares(a);
								} else {
									const a = supl;
									a.push(jugador);
									changeSupl(a);
								}
								setShowModal(false);
							}
						)}
					</>
				</IonContent>
			</IonModal>
		</>
	);
}
export function OrdenarPorPosiciones(
	jugadores: Jugador[],
	cambiarJugador: (jugador: Jugador) => void
): JSX.Element {
	const porteros = jugadores.filter((j) => j.posicion === "Portero");
	const defensas = jugadores.filter((j) => j.posicion === "Defensa");
	const mediocentros = jugadores.filter((j) => j.posicion === "Mediocentro");
	const delanteros = jugadores.filter((j) => j.posicion === "Delantero");

	return (
		<>
			<IonItemDivider>Porteros</IonItemDivider>
			{porteros.map((j) => {
				return (
					<IonItem onClick={() => cambiarJugador(j)}>
						<IonLabel>{j.nombre}</IonLabel>
					</IonItem>
				);
			})}
			<IonItemDivider>Defensas</IonItemDivider>
			{defensas.map((j) => {
				return (
					<IonItem onClick={() => cambiarJugador(j)}>
						<IonLabel>{j.nombre}</IonLabel>
					</IonItem>
				);
			})}
			<IonItemDivider>Mediocentros</IonItemDivider>
			{mediocentros.map((j) => {
				return (
					<IonItem onClick={() => cambiarJugador(j)}>
						<IonLabel>{j.nombre}</IonLabel>
					</IonItem>
				);
			})}
			<IonItemDivider>Delanteros</IonItemDivider>
			{delanteros.map((j) => {
				return (
					<IonItem onClick={() => cambiarJugador(j)}>
						<IonLabel>{j.nombre}</IonLabel>
					</IonItem>
				);
			})}
		</>
	);
}
