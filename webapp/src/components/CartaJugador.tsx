import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonImg,
	IonModal,
	IonRow,
	IonText,
	useIonActionSheet
} from "@ionic/react";

import { useEffect, useRef, useState } from "react";
import { getJugadorById } from "../api/api";
import { Jugador } from "../shared/sharedTypes";
import { getIconoEstado, urlBackground } from "./helpers";

type CartaJugadorProps = {
	id: string;
};

export function CartaJugador(props: CartaJugadorProps): JSX.Element {
	const [jugador, setJugador] = useState<Jugador>();
	//`https:\/\/assets.laligafantasymarca.com\/players\/t186\/p${jugador.fantasyMarcaId}\/256x256\/p${jugador.fantasyMarcaId}_t186_1_001_000.png`

	const getJugador = async () => {
		setJugador(await getJugadorById(props.id));
	};

	useEffect(() => {
		setPresentingElement(page.current);
		getJugador();
	}, []);

	const modal = useRef<HTMLIonModalElement>(null);
	const page = useRef(null);

	const [presentingElement, setPresentingElement] =
		useState<HTMLElement | null>(null);
	const [present] = useIonActionSheet();

	function dismiss() {
		modal.current?.dismiss();
	}

	return jugador ? (
		<IonCard
			onClick={() =>
				present({
					buttons: [{ text: "Ok" }, { text: "Cancel" }],
					header: "Action Sheet",
				})
			}
			style={{ width: 100 }}
		>
			<div
				style={{
					backgroundImage: urlBackground,
				}}
			>
				<IonCardContent>
					<IonRow style={{ width: 100, height: 50, marginLeft: -20 }}>
						<IonCol>
							<div style={{ marginTop: -18 }}>
								<IonImg src={jugador.foto} />
							</div>
						</IonCol>
						<div style={{ width: 20, height: 20 }}>
							<IonImg
								src={
									"https://api.sofascore.app/api/v1/team/" +
									jugador?.idEquipo +
									"/image"
								}
							/>

							<div style={{ marginTop: 30 }}>{getIconoEstado(jugador)}</div>
						</div>
					</IonRow>
				</IonCardContent>
			</div>

			<div style={{ background: "primary" }}>
				<IonRow>
					<IonCol>
						<IonText
							style={{ color: "black", fontSize: "11px", fontWeight: "bold" }}
						>
							{jugador.nombre}
						</IonText>
					</IonCol>
				</IonRow>
			</div>

			<IonModal
				ref={modal}
				trigger="open-modal"
				presentingElement={presentingElement!}
			>
				<IonButton onClick={() => dismiss()}>Close</IonButton>
			</IonModal>
		</IonCard>
	) : (
		<></>
	);
}
