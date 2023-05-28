import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCol,
    IonGrid,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonList,
    IonPopover,
    IonRow,
    IonSelect,
    IonSelectOption,
    useIonActionSheet,
    useIonToast,
} from "@ionic/react";
import { build, close, ellipsisVertical, remove } from "ionicons/icons";
import { useState } from "react";
import styled from "styled-components";
import { updateJugador } from "../../endpoints/jugadorEndpoints";
import { Equipo, Jugador } from "../../shared/sharedTypes";
import { ModalJugadorAdmin } from "./ModalJugadorAdmin";

const MyGrid = styled(IonGrid)`
	--ion-grid-columns: 7;
`;

type CartaJugadorAdminProps = {
	jugador: Jugador;
	setAnyEdited: (b: boolean) => void;
	equipos: Equipo[];
};

export function CartaJugadorAdmin(props: CartaJugadorAdminProps): JSX.Element {
	const [actionSheet] = useIonActionSheet();

	const [edited, setEdited] = useState<boolean>(false);

	const [jugador, setJugador] = useState<Jugador>(props.jugador);

	const [showModal, setShowModal] = useState(true);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	const setEditedPlayer = () => {
		setEdited(true);
		props.setAnyEdited(true);
	};

	const resetValores = () => {
		setJugador(props.jugador);
		setEdited(false);
	};

	const updateJugadorAndReset = async () => {
		resetValores();
		setEdited(false);
		await updateJugador(jugador)
			.then((j) => {
				crearToast("Jugador actualizado correctamente", true, "success");
				setJugador(j);
			})
			.catch((err) => {
				crearToast(err.message, true, "danger");
			});
		setShowPopover(false);
	};

	const [showPopover, setShowPopover] = useState(false);

	function seguroEliminarJugador() {
		return new Promise<boolean>((resolve, reject) => {
			actionSheet({
				header: "¿Estas seguro de querer borrar este jugador?",
				buttons: [
					{
						text: "Si",
						role: "confirm",
					},
					{
						text: "No",
						role: "cancel",
					},
				],
				onWillDismiss: (ev) => {
					if (ev.detail.role === "confirm") {
						crearToast("Jugador eliminado", true, "success");
					} else {
						reject();
					}
				},
			});
		});
	}

	return (
		<>
			<IonCard>
				<IonCardContent>
					<MyGrid>
						<IonRow>
							<IonCol size="7" sizeSm="1">
								<IonRow style={{ justifyContent: "space-around" }}>
									<IonImg
										src={jugador.foto}
										style={{
											maxWidth: "50px",
											maxHeight: "50px",
										}}
									></IonImg>
								</IonRow>
							</IonCol>
							<IonCol size="7" sizeSm="1">
								<IonItem fill="outline">
									<IonInput
										type="text"
										value={jugador.nombre}
										onIonInput={(e) => {
											setJugador({
												...jugador,
												nombre: e.target.value as string,
											});
											setEditedPlayer();
										}}
									></IonInput>
								</IonItem>
							</IonCol>
							<IonCol size="7" sizeSm="1">
								<IonItem>
									<IonInput
										type="number"
										value={jugador.valor}
										onIonInput={(e) => {
											setJugador({
												...jugador,
												valor: parseInt(e.target.value as string),
											});
											setEditedPlayer();
										}}
									></IonInput>
								</IonItem>
							</IonCol>
							<IonCol size="7" sizeSm="1">
								<IonSelect
									value={jugador.estado}
									onIonChange={(e) => {
										setJugador({
											...jugador,
											estado: e.detail.value,
										});
										setEditedPlayer();
									}}
								>
									<IonSelectOption value="Disponible">
										Disponible
									</IonSelectOption>
									<IonSelectOption value="Dudoso">Dudoso</IonSelectOption>
									<IonSelectOption value="Lesionado">Lesionado</IonSelectOption>
									<IonSelectOption value="Sancionado">
										Sancionado
									</IonSelectOption>
									<IonSelectOption value="No disponible">
										No disponible
									</IonSelectOption>
								</IonSelect>
							</IonCol>
							<IonCol size="7" sizeSm="1">
								<IonSelect
									value={jugador.posicion}
									onIonChange={(e) => {
										setJugador({
											...jugador,
											posicion: e.detail.value,
										});
										setEditedPlayer();
									}}
								>
									<IonSelectOption value="Portero">Portero</IonSelectOption>
									<IonSelectOption value="Defensa">Defensa</IonSelectOption>
									<IonSelectOption value="Mediocentro">
										Mediocentro
									</IonSelectOption>
									<IonSelectOption value="Delantero">Delantero</IonSelectOption>
								</IonSelect>
							</IonCol>
							<IonCol size="7" sizeSm="2">
								<IonRow style={{ justifyContent: "space-around" }}>
									<IonCol size="3">
										<IonButton
											expand="block"
											size="small"
											disabled={!edited}
											color="success"
											onClick={async () => await updateJugadorAndReset()}
										>
											Guardar
										</IonButton>
									</IonCol>
									<IonCol size="3">
										<IonButton
											expand="block"
											size="small"
											disabled={!edited}
											color="danger"
											onClick={() => resetValores()}
										>
											Reset
										</IonButton>
									</IonCol>
									<IonCol size="1">
										<IonButton
											onClick={() => setShowPopover(true)}
											fill="clear"
											size="small"
											id="popover-button"
										>
											<IonIcon
												slot="icon-only"
												icon={ellipsisVertical}
											></IonIcon>
										</IonButton>
									</IonCol>
								</IonRow>
								<IonPopover
									isOpen={showPopover}
									onDidDismiss={() => setShowPopover(false)}
								>
									<IonList>
										<IonItem
											id="open-modal"
											button={true}
											detail={false}
											onClick={() => {
												setShowModal(true);
											}}
										>
											<IonIcon slot="start" icon={build} />
											Editar jugador completo
										</IonItem>
										{showModal ? (
											<ModalJugadorAdmin
												jugador={jugador}
												equipos={props.equipos}
												updateJugador={updateJugadorAndReset}
											/>
										) : null}

										<IonItem
											button={true}
											detail={false}
											onClick={() => seguroEliminarJugador()}
										>
											<IonIcon slot="start" icon={remove} />
											Eliminar jugador
										</IonItem>
										<IonItem
											onClick={() => setShowPopover(false)}
											button={true}
											detail={false}
										>
											<IonIcon slot="start" icon={close}></IonIcon>
											Cancelar
										</IonItem>
									</IonList>
								</IonPopover>
							</IonCol>
						</IonRow>
					</MyGrid>
				</IonCardContent>
			</IonCard>
		</>
	);
}
