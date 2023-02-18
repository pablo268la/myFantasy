import { OverlayEventDetail } from "@ionic/core";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonImg,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    useIonAlert,
    useIonToast,
} from "@ionic/react";
import { useRef, useState } from "react";
import { updateJugador } from "../../endpoints/jugadorEndpoints";
import { Equipo, Jugador } from "../../shared/sharedTypes";

type ModalJugadorAdminProps = {
	jugador: Jugador;
	equipos: Equipo[];
	getJugadoresFromApi: (idEquipo: string, fromModal: boolean) => void;
};

export function ModalJugadorAdmin(props: ModalJugadorAdminProps): JSX.Element {
	const [alert] = useIonAlert();
	const [toast] = useIonToast();

	const modal = useRef<HTMLIonModalElement>(null);
	const input = useRef<HTMLIonInputElement>(null);

	const [jugador, setJugador] = useState<Jugador>(props.jugador);
	const [equipos, setEquipos] = useState<Equipo[]>(props.equipos);

	const [message, setMessage] = useState(
		"This modal example uses triggers to automatically open a modal when the button is clicked."
	);

	async function confirmModal() {
		updateJugador(jugador)
			.then((jugador) => {
				setJugador(jugador);
				props.getJugadoresFromApi(jugador.equipo._id, true);
				toast({
					message: "Jugador actualizado correctamente",
					duration: 2000,
					color: "success",
				});
				modal.current?.dismiss(input.current?.value, "confirm");
			})
			.catch((err) => {
				alert({
					header: "Error",
					message: err.message,
					buttons: ["OK"],
				});
			});
	}

	function onWillDismissModal(ev: CustomEvent<OverlayEventDetail>) {
		if (ev.detail.role === "confirm") {
			setMessage(`Hello, ${ev.detail.data}!`);
		}
	}

	return (
		<IonModal
			ref={modal}
			trigger="open-modal"
			onWillDismiss={(ev) => onWillDismissModal(ev)}
		>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => modal.current?.dismiss()}>
							Cancel
						</IonButton>
					</IonButtons>
					<IonTitle>Welcome</IonTitle>
					<IonButtons slot="end">
						<IonButton strong={true} onClick={() => confirmModal()}>
							Confirm
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonItem>
					<IonLabel position="stacked">Nombre</IonLabel>
					<IonInput
						ref={input}
						type="text"
						value={jugador.nombre}
						onIonChange={(e) => {
							setJugador({
								...jugador,
								nombre: e.detail.value!,
							});
						}}
					/>
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Equipo</IonLabel>
					<IonSelect
						value={jugador.equipo._id}
						onIonChange={(e) => {
							setJugador({
								...jugador,
								equipo: equipos.find(
									(equipo) => equipo._id === e.detail.value!
								)!,
							});
						}}
					>
						{equipos.map((equipo) => (
							<IonSelectOption key={equipo._id} value={equipo._id}>
								{equipo.nombre}
							</IonSelectOption>
						))}
					</IonSelect>
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Valor</IonLabel>
					<IonInput
						type="number"
						value={jugador.valor.toString()}
						onIonChange={(e) => {
							setJugador({
								...jugador,
								valor: parseInt(e.detail.value!),
							});
						}}
					/>
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Posicion</IonLabel>
					<IonSelect
						value={jugador.posicion}
						onIonChange={(e) => {
							setJugador({
								...jugador,
								posicion: e.detail.value!,
							});
						}}
					>
						<IonSelectOption value="Portero">Portero</IonSelectOption>
						<IonSelectOption value="Defensa">Defensa</IonSelectOption>
						<IonSelectOption value="Mediocentro">Mediocentro</IonSelectOption>
						<IonSelectOption value="Delantero">Delantero</IonSelectOption>
					</IonSelect>
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">Estado</IonLabel>
					<IonSelect
						value={jugador.estado}
						onIonChange={(e) => {
							setJugador({
								...jugador,
								estado: e.detail.value!,
							});
						}}
					>
						<IonSelectOption value="Disponible">Disponible</IonSelectOption>
						<IonSelectOption value="Dudoso">Dudoso</IonSelectOption>
						<IonSelectOption value="Lesionado">Lesionado</IonSelectOption>
						<IonSelectOption value="Sancionado">Sancionado</IonSelectOption>
						<IonSelectOption value="No disponible">
							No disponible
						</IonSelectOption>
					</IonSelect>
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">URL Foto</IonLabel>
					<IonInput
						type="text"
						value={jugador.foto}
						onIonChange={(e) => {
							setJugador({
								...jugador,
								foto: e.detail.value!,
							});
						}}
					/>
				</IonItem>
				<IonImg src={jugador.foto} />
			</IonContent>
		</IonModal>
	);
}
