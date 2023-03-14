import {
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonList,
	IonMenu,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import {
	cart,
	football,
	gameController,
	home,
	list,
	people,
	tv,
} from "ionicons/icons";
import { getUsuarioLogueado } from "../../helpers/helpers";

export function MenuLateral(props: any): JSX.Element {
	//const nav = useIonRouter(); onClick={() => nav.push("/home", "forward")}

	return (
		<>
			<IonMenu type="reveal" contentId="main-content">
				<IonHeader>
					<IonToolbar>
						<IonTitle>Menu</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						<IonItem href="/home">
							<IonIcon slot="start" icon={home}></IonIcon>
							Home
						</IonItem>

						<IonItem href="/ligas">
							<IonIcon slot="start" icon={gameController}></IonIcon>
							Mis ligas
						</IonItem>
						<IonItem href={"/clasificacion"}>
							<IonIcon slot="start" icon={list}></IonIcon>
							Clasificacion
						</IonItem>
						<IonItem href={"/plantilla/" + getUsuarioLogueado()?.id}>
							<IonIcon slot="start" icon={people}></IonIcon>
							Plantilla
						</IonItem>
						<IonItem href={"/mercado"}>
							<IonIcon slot="start" icon={cart}></IonIcon>
							Mercado
						</IonItem>
						<IonItem href={"/resultados"}>
							<IonIcon slot="start" icon={football}></IonIcon>
							Resultados
						</IonItem>
						<IonItem href="/admin">
							<IonIcon slot="start" icon={tv}></IonIcon>
							Admin
						</IonItem>
					</IonList>
				</IonContent>
			</IonMenu>
		</>
	);
}
