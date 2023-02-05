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
import { pencilOutline } from "ionicons/icons";
import { useState } from "react";
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
							placeholder={jugador.estado}
							onIonChange={() => setEdited(true)}
						>
							<IonSelectOption value="disponible">Disponible</IonSelectOption>
							<IonSelectOption value="lesionado">Lesionado</IonSelectOption>
							<IonSelectOption value="sancionado">Sancionado</IonSelectOption>
							<IonSelectOption value="no disponible">
								No disponible
							</IonSelectOption>
						</IonSelect>
					</IonRow>
				</IonCol>
				<IonCol style={{ borderInlineStart: "1px solid" }}>
					<IonRow style={{ justifyContent: "start" }}>
						<IonSelect
							placeholder={jugador.posicion}
							onIonChange={() => setEdited(true)}
						>
							<IonSelectOption value="portero">Portero</IonSelectOption>
							<IonSelectOption value="defensa">Defensa</IonSelectOption>
							<IonSelectOption value="centrocampista">
								Centrocampista
							</IonSelectOption>
							<IonSelectOption value="delantero">Delantero</IonSelectOption>
						</IonSelect>
					</IonRow>
				</IonCol>
				<IonCol style={{ borderInlineStart: "1px solid" }}>
					<IonButton disabled={!edited} color="success">
						Guardar
					</IonButton>
					<IonButton disabled={!edited} color="danger">
						Reset
					</IonButton>
				</IonCol>
			</IonRow>
		</>
	);
}
