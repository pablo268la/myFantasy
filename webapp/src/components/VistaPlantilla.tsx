import {
	IonCol,
	IonContent,
	IonHeader,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar
} from "@ionic/react";
import { CartaJugador } from "./CartaJugador";
import { ListaJugadores } from "./ListaJugadores";
import { MenuLateral } from "./MenuLateral";

export function Tab2(): JSX.Element {
	return (
		<>
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Mi plantilla</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonRow>
						<MenuLateral />
						<div
							style={{
								width: 600,
								height: 600,
								backgroundImage:
									"url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/225px-Soccer_Field_Transparant.svg.png)",
								backgroundSize: "cover",
								marginBottom: 25,
							}}
						>
							<IonRow>
								<IonCol offset="5">
									<CartaJugador id="70988" />
								</IonCol>
							</IonRow>
							<IonRow>
								<IonCol>
									<CartaJugador id="138572" />
								</IonCol>
								<IonCol>
									<CartaJugador id="822519" />
								</IonCol>
								<IonCol>
									<CartaJugador id="66492" />
								</IonCol>
								<IonCol>
									<CartaJugador id="792073" />
								</IonCol>
							</IonRow>
							<IonRow>
								<IonCol offset="1">
									<CartaJugador id="15466" />
								</IonCol>
								<IonCol>
									<CartaJugador id="859025" />
								</IonCol>
								<IonCol>
									<CartaJugador id="973887" />
								</IonCol>
							</IonRow>
							<IonRow>
								<IonCol offset="1">
									<CartaJugador id="910536" />
								</IonCol>
								<IonCol>
									<CartaJugador id="3306" />
								</IonCol>
								<IonCol>
									<CartaJugador id="868812" />
								</IonCol>
							</IonRow>
						</div>
						<div style={{ width: 540, height: 600, marginLeft: "1%" }}>
							<ListaJugadores />
						</div>
					</IonRow>
				</IonContent>
			</IonPage>
		</>
	);
}
