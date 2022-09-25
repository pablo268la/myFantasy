import { IonActionSheet, IonButton, IonContent } from "@ionic/react";
import { caretForwardCircle, close, heart, trash } from "ionicons/icons";
import { useState } from "react";

export function Clasificacion(props: any): JSX.Element {
	const [showActionSheet, setShowActionSheet] = useState(false);
	return (
		<>
			<IonContent>
				<IonButton onClick={() => setShowActionSheet(true)} expand="block">
					Show Action Sheet
				</IonButton>
				<IonActionSheet
					isOpen={showActionSheet}
					onDidDismiss={() => setShowActionSheet(false)}
					buttons={[
						{
							text: "Delete",
							role: "destructive",
							icon: trash,
							id: "delete-button",
							data: {
								type: "delete",
							},
							handler: () => {
								console.log("Delete clicked");
							},
						},
						{
							text: "Play (open modal)",
							icon: caretForwardCircle,
							data: "Data value",
							handler: () => {
								console.log("Play clicked");
							},
						},
						{
							text: "Favorite",
							icon: heart,
							handler: () => {
								console.log("Favorite clicked");
							},
						},
						{
							text: "Cancel",
							icon: close,
							role: "cancel",
							handler: () => {
								console.log("Cancel clicked");
							},
						},
					]}
				></IonActionSheet>
			</IonContent>
		</>
	);
}
