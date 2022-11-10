import { IonButton, IonContent } from "@ionic/react";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";

export function Home(props: any): JSX.Element {
	useEffect(() => {}, []);

	return (
		<>
			<IonContent>
				<IonButton href="/plantilla"> Plantilla</IonButton>
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						console.log(credentialResponse);
					}}
					onError={() => {
						console.log("Login Failed");
					}}
				/>
				;
			</IonContent>
		</>
	);
}
