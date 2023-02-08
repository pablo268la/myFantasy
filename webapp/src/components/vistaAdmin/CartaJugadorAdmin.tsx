import {
	IonButton,
	IonCol,
	IonIcon,
	IonImg,
	IonInput,
	IonItem,
	IonRow,
	IonSelect,
	IonSelectOption,
} from "@ionic/react";
import { ellipsisVertical, pencilOutline } from "ionicons/icons";
import { useState } from "react";
import { updateJugador } from "../../endpoints/jugadorEndpoints";
import { Jugador } from "../../shared/sharedTypes";

type CartaJugadorAdminProps = {
	jugador: Jugador;
	setAnyEdited: (b: boolean) => void;
};

export function CartaJugadorAdmin(props: CartaJugadorAdminProps): JSX.Element {
	const [isReadOnlyNombre, setIsReadOnlyNombre] = useState<boolean>(true);
	const [isReadOnlyValor, setIsReadOnlyValor] = useState<boolean>(true);
	const [edited, setEdited] = useState<boolean>(false);

	const [jugador, setJugador] = useState<Jugador>(props.jugador);

	const setEditedPlayer = () => {
		setEdited(true);
		props.setAnyEdited(true);
	};

	const resetValores = () => {
		setIsReadOnlyNombre(true);
		setIsReadOnlyValor(true);
		setJugador(props.jugador);
		setEdited(false);
	};

	const updateJugadorAndReset = async () => {
		resetValores();
		setJugador(await updateJugador(jugador));
	};

	return (
		<>
			<IonRow style={{ justifyContent: "space-around" }}>
				<IonCol>
					<IonRow style={{ justifyContent: "space-around" }}>
						<IonImg
							src={jugador.foto}
							style={{
								maxWidth: "30px",
								maxHeight: "30px",
							}}
						></IonImg>
					</IonRow>
				</IonCol>
				<IonCol style={{ borderInlineStart: "1px solid" }}>
					<IonRow style={{ justifyContent: "start" }}>
						<IonItem>
							<IonInput
								readonly={isReadOnlyNombre}
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
							<IonButton
								fill="outline"
								onClick={() => {
									setIsReadOnlyNombre(false);
									setEditedPlayer();
								}}
							>
								<IonIcon slot="icon-only" icon={pencilOutline}></IonIcon>
							</IonButton>
						</IonItem>
					</IonRow>
				</IonCol>
				<IonCol style={{ borderInlineStart: "1px solid" }}>
					<IonRow style={{ justifyContent: "start" }}>
						<IonItem>
							<IonInput
								readonly={isReadOnlyValor}
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
							<IonButton
								fill="outline"
								onClick={() => {
									setIsReadOnlyValor(false);
									setEditedPlayer();
								}}
							>
								<IonIcon slot="icon-only" icon={pencilOutline}></IonIcon>
							</IonButton>
						</IonItem>
					</IonRow>
				</IonCol>
				<IonCol style={{ borderInlineStart: "1px solid" }}>
					<IonRow style={{ justifyContent: "start" }}>
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
							<IonSelectOption value="Disponible">Disponible</IonSelectOption>
							<IonSelectOption value="Dudoso">Dudoso</IonSelectOption>
							<IonSelectOption value="Lesionado">Lesionado</IonSelectOption>
							<IonSelectOption value="Sancionado">Sancionado</IonSelectOption>
							<IonSelectOption value="No disponible">
								No disponible
							</IonSelectOption>
						</IonSelect>
					</IonRow>
				</IonCol>
				<IonCol style={{ borderInlineStart: "1px solid" }}>
					<IonRow style={{ justifyContent: "start" }}>
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
							<IonSelectOption value="Mediocentro">Mediocentro</IonSelectOption>
							<IonSelectOption value="Delantero">Delantero</IonSelectOption>
						</IonSelect>
					</IonRow>
				</IonCol>
				<IonCol style={{ borderInlineStart: "1px solid" }}>
					<IonRow>
						<IonButton 
							size="small"
							disabled={!edited}
							color="success"
							onClick={() => updateJugadorAndReset()}
						>
							Guardar
						</IonButton>
						<IonButton
							size="small"
							disabled={!edited}
							color="danger"
							onClick={() => resetValores()}
						>
							Reset
						</IonButton>
						<IonButton fill="clear" size="small">
							<IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
						</IonButton>
					</IonRow>
				</IonCol>
			</IonRow>
		</>
	);
}
