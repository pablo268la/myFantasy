import { IonButtons, IonMenuButton, IonTitle, IonToolbar } from "@ionic/react";

export function FantasyToolbar(props: any): JSX.Element {
	return (
		<>
			<IonToolbar>
				<IonButtons slot="start">
					<IonMenuButton></IonMenuButton>
				</IonButtons>
				<IonTitle>Menu</IonTitle>
			</IonToolbar>
		</>
	);
}
