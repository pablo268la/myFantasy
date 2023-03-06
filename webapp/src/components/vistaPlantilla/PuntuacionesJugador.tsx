import {
    IonCard,
    IonCardContent,
    IonItemDivider,
    IonLabel,
    IonList,
    IonRow,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getPuntuacionJugador } from "../../endpoints/puntuacionesController";
import { PropiedadJugador, PuntuacionJugador } from "../../shared/sharedTypes";

type PuntuacionesJugadorProps = {
	jugador: PropiedadJugador;
};

export function PuntuacionesJugador(
	props: PuntuacionesJugadorProps
): JSX.Element {
	const [puntuaciones, setPuntuaciones] = useState<PuntuacionJugador[]>([]);

	useEffect(() => {
		getPuntuacionJugador(props.jugador.jugador).then((p) => {
			setPuntuaciones(p);
		});
	});

	return (
		<IonList>
			<IonLabel>{props.jugador.jugador.nombre}</IonLabel>
			<>
				<IonRow>
					{puntuaciones.map((p) => {
						return (
							<>
								<IonCard>
									<IonCardContent>
										<IonLabel>{p.puntos}</IonLabel>
									</IonCardContent>
									<IonItemDivider />
									<IonLabel>J{p.semana}</IonLabel>
								</IonCard>
							</>
						);
					})}
				</IonRow>
			</>
		</IonList>
	);
}
