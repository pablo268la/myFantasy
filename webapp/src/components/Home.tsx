import {
	IonButton,
	IonCol,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonNote,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar,
	useIonToast
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { useEffect, useState } from "react";
import * as UUID from "uuid";
import { createUsuario, getUsuario } from "../endpoints/userEndpoints";
import { Usuario } from "../shared/sharedTypes";

export function Home(props: any): JSX.Element {
	const [id, setId] = useState<string>(UUID.v4());
	const [email, setEmail] = useState<string>("");
	const [contraseña, setContraseña] = useState<string>("");
	const [repPassword, setRepPassword] = useState<string>("");
	const [nombre, setNombre] = useState<string>("");
	const [token, setToken] = useState<string>("");
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const [validated, setValidated] = useState<boolean>();

	const [usuario, setUsuario] = useState<Usuario>();

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean) {
		if (mostrarToast)
			present({
				message: mensaje,
				duration: 1500,
			});
	}

	useEffect(() => {}, []);

	async function validateFields(mostrarToast: boolean) {
		if (email === "" || contraseña === "") {
			crearToast("Por favor, rellena todos los campos", mostrarToast);
			return;
		}

		if (!validateEmail(email)) {
			setValidated(false);
			crearToast("Formato de email incorrecto", mostrarToast);
			return;
		}

		if (!isLogin) {
			if (nombre.length < 1) {
				setValidated(false);
				crearToast("El nombre no puede estar vacio", mostrarToast);
				return;
			}

			if (!validatePassword(contraseña)) {
				setValidated(false);
				crearToast(
					"La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
					mostrarToast
				);
				return;
			}

			if (contraseña !== repPassword) {
				crearToast("Las contraseñas no coinciden", mostrarToast);
				return;
			}
		}
		let usuario = await getUsuario(email);
		if (isLogin) {
			if (usuario !== null && usuario.contraseña === contraseña) {
				setValidated(true);
			} else {
				setValidated(false);
				crearToast("Email o contraseña incorrectos", mostrarToast);
			}
		} else {
			if (usuario !== null) {
				setValidated(false);
				console.log(email);
				crearToast("El email ya está en uso", mostrarToast);
			} else {
				setValidated(true);
			}
		}
	}

	function validateEmail(email: string) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			return true;
		}
		//alert("You have entered an invalid email address!");
		return false;
	}

	async function validatePassword(password: string) {
		if (
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password) &&
			password.length > 7
		) {
			return true;
		}
		return false;
	}

	async function entrarApp() {
		if (isLogin) {
			setUsuario(await getUsuario(email));
		} else {
			setUsuario(
				await createUsuario({
					id: id,
					nombre: nombre,
					email: email,
					contraseña: contraseña,
					ligas: [],
					token: "",
				})
			);
		}
	}

	return (
		<>
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Login</IonTitle>
					</IonToolbar>
				</IonHeader>

				<IonContent style={{ width: 400 }}>
					<IonRow style={{ justifyContent: "center" }}>
						<IonIcon
							style={{ fontSize: "70px", color: "#562765" }}
							icon={personCircle}
						/>
					</IonRow>
					<IonRow>
						<IonCol>
							{!isLogin ? (
								<>
									<IonItem>
										<IonLabel position="floating"> Nombre</IonLabel>
										<IonInput
											value={nombre}
											onIonChange={(e) => {
												setNombre(e.detail.value!.trim());
												validateFields(false);
											}}
										></IonInput>
									</IonItem>
								</>
							) : (
								<></>
							)}
							<IonItem>
								<IonLabel position="floating">Email</IonLabel>
								<IonInput
									type="email"
									onIonChange={(e) => {
										setEmail(e.detail.value!.trim());
										validateFields(false);
									}}
								></IonInput>
							</IonItem>
							<IonItem>
								<IonLabel position="floating"> Contraseña</IonLabel>
								<IonInput
									type="password"
									value={contraseña}
									onIonChange={(e) => {
										setContraseña(e.detail.value!.trim());
										validateFields(false);
									}}
								></IonInput>
							</IonItem>
							{!isLogin ? (
								<>
									<IonItem>
										<IonLabel position="floating"> Repetir contraseña</IonLabel>
										<IonInput
											type="password"
											value={repPassword}
											onIonChange={(e) => {
												setRepPassword(e.detail.value!.trim());
												validateFields(false);
											}}
										></IonInput>
										<IonNote slot="error">Las contraseñas no coinciden</IonNote>
									</IonItem>
								</>
							) : (
								<></>
							)}
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							{validated ? (
								<IonButton
									expand="block"
									href={"/plantilla/" + token}
									onClick={() => entrarApp()}
								>
									Entrar
								</IonButton>
							) : (
								<IonButton expand="block" onClick={() => validateFields(true)}>
									Entrar
								</IonButton>
							)}
							{isLogin ? (
								<p style={{ fontSize: "medium" }}>
									¿No tienes cuenta?{"  "}
									<a
										onClick={(e) => {
											setIsLogin(false);
										}}
									>
										Crea una cuenta
									</a>
								</p>
							) : (
								<p style={{ fontSize: "medium" }}>
									Ya tengo cuenta.{"  "}
									<a
										onClick={(e) => {
											setIsLogin(true);
										}}
									>
										Entrar con cuenta
									</a>
								</p>
							)}
						</IonCol>
					</IonRow>
				</IonContent>
			</IonPage>
		</>
	);
}
