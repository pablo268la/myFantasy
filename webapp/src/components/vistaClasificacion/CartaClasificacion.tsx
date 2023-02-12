import { Icon } from "@iconify/react";
import {
    IonCard,
    IonCardContent,
    IonCol,
    IonLabel,
    IonRow,
} from "@ionic/react";
import { urlBackground2 } from "../../helpers/helpers";
import { PlantillaUsuario } from "../../shared/sharedTypes";

type CartaClasificacionProps = {
	plantilla: PlantillaUsuario;
	posicion: number;
};

export function CartaClasificaion(props: any): JSX.Element {
	const plantilla = props.plantilla;
	const posicion = props.posicion;

	const getColorPorPosicion = () => {
		switch (posicion) {
			case 0:
				return "gold";
			case 1:
				return "silver";
			case 2:
				return "BF8970";
			default:
				return "#000000";
		}
	};

	return (
		<IonCard>
			<IonCardContent
				style={{
					background: urlBackground2,
				}}
			>
				<IonRow style={{ alignItems: "center" }}>
					<IonCol size="3">
						<Icon
							icon={"mdi:number-" + (posicion + 1) + "-circle"}
							color={getColorPorPosicion()}
							width="60"
							height="60"
						/>
					</IonCol>
					<IonCol style={{ alignItems: "center" }}>
						<IonRow
							style={{
								justifyContent: "space-between",
							}}
						>
							<IonLabel style={{ fontSize: "25px", color: "white" }}>
								{plantilla.usuario.nombre}
							</IonLabel>

							<IonLabel style={{ fontSize: "20px", color: "white" }}>
								{plantilla.puntos} pts
							</IonLabel>
						</IonRow>
					</IonCol>
				</IonRow>
			</IonCardContent>
		</IonCard>
	);
}
