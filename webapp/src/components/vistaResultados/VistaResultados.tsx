import {
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { Route } from "react-router";

import { library, playCircle, radio, search } from "ionicons/icons";
import { Home } from "../Home";

export function VistaResultados(): JSX.Element {
	return (
		<IonReactRouter>
			<IonTabs>
				<IonRouterOutlet>
					{/*
          Use the render method to reduce the number of renders your component will have due to a route change.

          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
          <Route path="/radio" render={() => <RadioPage />} exact={true} />
          <Route path="/library" render={() => <LibraryPage />} exact={true} />
        <Route path="/search" render={() => <SearchPage />} exact={true} />
        */}
					<Route path="/resultados/home" render={() => <Home />} exact={true} />
				</IonRouterOutlet>

				<IonTabBar slot="bottom">
					<IonTabButton tab="home" href="/resultados/home">
						<IonIcon icon={playCircle} />
						<IonLabel>Listen now</IonLabel>
					</IonTabButton>

					<IonTabButton tab="radio" href="/radio">
						<IonIcon icon={radio} />
						<IonLabel>Radio</IonLabel>
					</IonTabButton>

					<IonTabButton tab="library" href="/library">
						<IonIcon icon={library} />
						<IonLabel>Library</IonLabel>
					</IonTabButton>

					<IonTabButton tab="search" href="/search">
						<IonIcon icon={search} />
						<IonLabel>Search</IonLabel>
					</IonTabButton>
				</IonTabBar>
			</IonTabs>
		</IonReactRouter>
	);
}
