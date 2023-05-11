import {
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonHeader,
	IonImg,
	IonInput,
	IonItem,
	IonLabel,
	IonModal,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { useRef, useState } from "react";
import { Equipo, Jugador } from "../../shared/sharedTypes";

type ModalJugadorAdminProps = {
	jugador: Jugador;
	equipos: Equipo[];
	updateJugador: (jugador: Jugador) => Promise<void>;
};

export function ModalJugadorAdmin(props: ModalJugadorAdminProps): JSX.Element {
	const modal = useRef<HTMLIonModalElement>(null);
	const input = useRef<HTMLIonInputElement>(null);

	const [jugador, setJugador] = useState<Jugador>(props.jugador);
	const [equipos, setEquipos] = useState<Equipo[]>(props.equipos);

	const jornadas = Array.from(Array(38).keys());

	async function confirmModal() {
		await props.updateJugador(jugador);
		modal.current?.dismiss(input.current?.value, "confirm");
	}

	return (
		<IonModal ref={modal} trigger="open-modal">
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => modal.current?.dismiss()}>
							Cancel
						</IonButton>
					</IonButtons>
					<IonTitle>{jugador.nombre}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => confirmModal()}>Confirm</IonButton>
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

				<IonRow>
					<IonCol size="8">
						<IonItem>
							<IonLabel position="stacked">Equipo antiguo</IonLabel>
							<IonSelect
								value={jugador.jugadorAntiguo?.equipo?._id}
								onIonChange={(e) => {
									setJugador({
										...jugador,
										jugadorAntiguo: {
											equipo: equipos.find(
												(equipo) => equipo._id === e.detail.value!
											)!,
											jornadaTraspaso:
												jugador.jugadorAntiguo?.jornadaTraspaso || 0,
										},
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
					</IonCol>
					<IonCol size="4">
						<IonItem>
							<IonLabel position="stacked">Jornada traspaso</IonLabel>
							<IonSelect
								value={jugador.jugadorAntiguo?.jornadaTraspaso}
								onIonChange={(e) => {
									setJugador({
										...jugador,
										jugadorAntiguo: {
											equipo: jugador.jugadorAntiguo?.equipo || undefined,
											jornadaTraspaso: parseInt(e.detail.value!) || 0,
										},
									});
								}}
							>
								{jornadas.map((jornada) => (
									<IonSelectOption key={jornada + 1} value={jornada + 1}>
										{jornada + 1}
									</IonSelectOption>
								))}
							</IonSelect>
						</IonItem>
					</IonCol>
				</IonRow>

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
