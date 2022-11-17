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
import Login from "./components/Login";
import VistaPlantilla from "./components/VistaPlantilla";
import { Usuario } from "./shared/sharedTypes";
import "./theme/variables.css";

setupIonicReact();

function App(): JSX.Element {
	const [usuario, setUsuario] = useState<Usuario>();

	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path="/">
						<Login usuario={usuario} setUsuario={setUsuario} />
					</Route>
					<Route exact path="/plantilla">
						<VistaPlantilla usuario={usuario} />
					</Route>
					<Route exact path="/clasificacion" component={Clasificacion}>
						<Clasificacion usuario={usuario} />
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
}

export default App;
