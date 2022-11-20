import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import { useState } from "react";
import Clasificacion from "./components/Clasificacion";
import { Home } from "./components/Home";
import Login from "./components/Login";
import VistaPlantilla from "./components/VistaPlantilla";
import { requestToken } from "./endpoints/userEndpoints";
import { Usuario } from "./shared/sharedTypes";
import "./theme/variables.css";

setupIonicReact();

function App(): JSX.Element {
	const [usuario, setUsuario] = useState<Usuario>();
	const [token, setToken] = useState<string>();

	async function setUsuarioAndRequestToken(
		email: string,
		contraseña: string
	): Promise<boolean> {
		const newToken = await requestToken(email, contraseña);
		if (newToken !== null && newToken !== undefined) {
			setToken(newToken);
			return true;
		} else {
			return false;
		}
	}

	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path="/">
						<Login />
					</Route>
					<Route exact path="/home">
						<Home />
					</Route>
					<Route exact path="/plantilla/">
						<VistaPlantilla />
					</Route>
					<Route exact path="/clasificacion" component={Clasificacion}>
						<Clasificacion />
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
}

export default App;
