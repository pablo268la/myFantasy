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

	console.log(getUsuarioLogueado()?.ligas);
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
						<IonItem
							disabled={getUsuarioLogueado()?.ligas.length === 0}
							href={"/clasificacion"}
						>
							<IonIcon slot="start" icon={list}></IonIcon>
							Clasificacion
						</IonItem>
						<IonItem
							disabled={getUsuarioLogueado()?.ligas.length === 0}
							href={"/plantilla/" + getUsuarioLogueado()?.id}
						>
							<IonIcon slot="start" icon={people}></IonIcon>
							Plantilla
						</IonItem>
						<IonItem
							disabled={getUsuarioLogueado()?.ligas.length === 0}
							href={"/mercado"}
						>
							<IonIcon slot="start" icon={cart}></IonIcon>
							Mercado
						</IonItem>
						<IonItem href={"/resultados"}>
							<IonIcon slot="start" icon={football}></IonIcon>
							Resultados
						</IonItem>

						{getUsuarioLogueado()?.admin ? (
							<IonItem href="/admin">
								<IonIcon slot="start" icon={tv}></IonIcon>
								Admin
							</IonItem>
						) : null}
					</IonList>
				</IonContent>
			</IonMenu>
		</>
	);
}
