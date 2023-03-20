import {
    IonAccordion,
    IonAccordionGroup,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCol,
    IonImg,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonRow,
} from "@ionic/react";
import { Partido } from "../../shared/sharedTypes";

type ResultadoProps = {
	partido: Partido;
};

export function Resultados(props: ResultadoProps): JSX.Element {
	return (
		<>
			<IonCard>
				<IonCardHeader>
					<IonRow className="ion-justify-content-center">
						<IonImg src={props.partido.local.escudo} style={{ width: 30 }} />
						<h5>
							{props.partido.local.nombre} {props.partido.resultadoLocal}-{" "}
							{props.partido.resultadoVisitante}{" "}
							{props.partido.visitante.nombre}
						</h5>
						<IonImg
							src={props.partido.visitante.escudo}
							style={{ width: 30 }}
						/>
					</IonRow>
				</IonCardHeader>
				<IonCardContent>
					<IonAccordionGroup>
						<IonAccordion value="first">
							<IonItem slot="header" color="light">
								<IonLabel>Ver puntos</IonLabel>
							</IonItem>
							<div className="ion-padding" slot="content">
								<IonRow>
									<IonCol sizeXs="6">
										{props.partido.alineacionLocal.jugadoresTitulares.map(
											(jugador) => (
												<IonItem>
													<IonImg src={jugador.foto} style={{ width: 30 }} />
													<IonLabel> {jugador.nombre}</IonLabel>

													<IonLabel slot="end"> {0}</IonLabel>
												</IonItem>
											)
										)}
										<IonItemDivider />
										{props.partido.alineacionLocal.jugadoresSuplentes.map(
											(jugador) => (
												<IonItem>
													<IonImg src={jugador.foto} style={{ width: 30 }} />
													<IonLabel> {jugador.nombre}</IonLabel>

													<IonLabel slot="end"> {0}</IonLabel>
												</IonItem>
											)
										)}
									</IonCol>
									<IonCol sizeXs="6">
										{props.partido.alineacionVisitante.jugadoresTitulares.map(
											(jugador) => (
												<IonItem>
													<IonLabel slot="end"> {jugador.nombre}</IonLabel>
													<IonImg
														src={jugador.foto}
														style={{ width: 30 }}
														slot="end"
													/>

													<IonLabel> {0}</IonLabel>
												</IonItem>
											)
										)}
										<IonItemDivider />
										{props.partido.alineacionVisitante.jugadoresSuplentes.map(
											(jugador) => (
												<IonItem>
													<IonLabel slot="end"> {jugador.nombre}</IonLabel>
													<IonImg
														src={jugador.foto}
														style={{ width: 30 }}
														slot="end"
													/>

													<IonLabel> {0}</IonLabel>
												</IonItem>
											)
										)}
									</IonCol>
								</IonRow>
							</div>
						</IonAccordion>
					</IonAccordionGroup>
				</IonCardContent>
			</IonCard>
		</>
	);
}
