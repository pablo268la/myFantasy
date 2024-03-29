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
import { Home } from "./components/Home";
import { VistaAdmin } from "./components/vistaAdmin/VistaAdmin";
import VistaClasificacion from "./components/vistaClasificacion/VistaClasificacion";
import { VistaCrearLiga } from "./components/vistaLigas/VistaCrearLiga";
import { VistaLigas } from "./components/vistaLigas/VistaLigas";
import Login from "./components/vistaLogin/Login";
import { VistaMercado } from "./components/vistaMercado/VistaMercado";
import { PlantillaStart } from "./components/vistaPlantilla/PlantillaStart";
import VistaPlantilla from "./components/vistaPlantilla/VistaPlantilla";
import { VistaResultados } from "./components/vistaResultados/VistaResultados";
import { getToken, getUsuarioLogueado } from "./helpers/helpers";
import "./theme/variables.css";

setupIonicReact();

function App(): JSX.Element {
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
					<Route exact path="/ligas">
						<VistaLigas
							email={getUsuarioLogueado()?.email as string}
							token={getToken()}
						/>
					</Route>
					<Route exact path="/ligas/create">
						<VistaCrearLiga />
					</Route>
					<Route exact path="/plantilla/:idUsuario">
						<VistaPlantilla />
					</Route>
					<Route exact path="/plantilla/starts/:idLiga">
						<PlantillaStart />
					</Route>
					<Route exact path="/clasificacion">
						<VistaClasificacion />
					</Route>
					<Route exact path="/admin">
						<VistaAdmin />
					</Route>
					<Route exact path="/mercado">
						<VistaMercado />
					</Route>
					<Route exact path="/resultados">
						<VistaResultados />
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
}

export default App;
