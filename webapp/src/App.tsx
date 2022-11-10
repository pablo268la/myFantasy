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
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Clasificacion } from "./components/Clasificacion";
import { Home } from "./components/Home";
import { VistaPlantilla } from "./components/VistaPlantilla";
import "./theme/variables.css";

setupIonicReact();

export default function App(): JSX.Element {
	return (
		<GoogleOAuthProvider clientId="829892800883-h5tthfnolflirkj5h6ms387skbrodgdn.apps.googleusercontent.com">
			<IonApp>
				<IonReactRouter>
					<IonRouterOutlet>
						<Route path="/">
							<Home />
						</Route>
						<Route path="/plantilla">
							<VistaPlantilla />
						</Route>
						<Route path="/clasificacion">
							<Clasificacion />
						</Route>
					</IonRouterOutlet>
				</IonReactRouter>
			</IonApp>
		</GoogleOAuthProvider>
	);
}
