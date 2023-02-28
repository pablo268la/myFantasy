import {
	IonButton,
	IonContent,
	IonHeader,
	IonIcon,
	IonList,
	IonMenu,
	IonRouterLink,
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
						<IonTitle></IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						<IonRouterLink href="/home">
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={home}></IonIcon>
								Home
							</IonButton>
						</IonRouterLink>
						<IonRouterLink href="/ligas">
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={gameController}></IonIcon>
								Mis ligas
							</IonButton>
						</IonRouterLink>
						<IonRouterLink
							href={"/clasificacion/" + getUsuarioLogueado()?.ligas[0]}
						>
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={list}></IonIcon>
								Clasificacion
							</IonButton>
						</IonRouterLink>
						<IonRouterLink
							href={
								"/plantilla/" +
								getUsuarioLogueado()?.ligas[0] +
								"/" +
								getUsuarioLogueado()?.id
							}
						>
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={people}></IonIcon>
								Plantilla
							</IonButton>
						</IonRouterLink>
						<IonRouterLink href={"/mercado/" + getUsuarioLogueado()?.ligas[0]}>
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={cart}></IonIcon>
								Mercado
							</IonButton>
						</IonRouterLink>
						<IonButton color="dark" expand="block" fill="clear">
							<IonIcon slot="start" icon={football}></IonIcon>
							Resultados
						</IonButton>
						<IonRouterLink href="/admin">
							<IonButton color="dark" expand="block" fill="clear">
								<IonIcon slot="start" icon={tv}></IonIcon>
								Admin
							</IonButton>
						</IonRouterLink>
					</IonList>
				</IonContent>
			</IonMenu>
		</>
	);
}
