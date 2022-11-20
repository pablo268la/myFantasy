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
	useIonRouter,
	useIonToast
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { useEffect, useState } from "react";
import { createUsuario, getUsuario } from "../endpoints/userEndpoints";
import { setUsuarioAndRequestToken } from "./helpers";

type LoginProps = {};

function Login(props: LoginProps): JSX.Element {
	const navigate = useIonRouter();

	const [email, setEmail] = useState<string>("");
	const [contraseña, setContraseña] = useState<string>("");
	const [repPassword, setRepPassword] = useState<string>("");
	const [nombre, setNombre] = useState<string>("");
	const [isLogin, setIsLogin] = useState<boolean>(true);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean) {
		if (mostrarToast)
			present({
				message: mensaje,
				duration: 1500,
			});
	}

	useEffect(() => {}, []);

	async function validateFields(mostrarToast: boolean): Promise<boolean> {
		if (email === "" || contraseña === "") {
			crearToast("Por favor, rellena todos los campos", mostrarToast);
			return false;
		}

		if (!validateEmail(email)) {
			crearToast("Formato de email incorrecto", mostrarToast);
			return false;
		}

		if (!isLogin) {
			if (nombre.length < 1) {
				crearToast("El nombre no puede estar vacio", mostrarToast);
				return false;
			}

			if (!validatePassword(contraseña)) {
				crearToast(
					"La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
					mostrarToast
				);
				return false;
			}

			if (contraseña !== repPassword) {
				crearToast("Las contraseñas no coinciden", mostrarToast);
				return false;
			}
		}
		let usuario = await getUsuario(email);
		if (isLogin) {
			if (usuario !== null) {
				return true;
			} else {
				crearToast("Email o contraseña incorrectos", mostrarToast);
				return false;
			}
		} else {
			if (usuario !== null) {
				crearToast("El email ya está en uso", mostrarToast);
				return false;
			} else {
				return true;
			}
		}
	}

	function validateEmail(email: string): boolean {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			return true;
		}
		//alert("You have entered an invalid email address!");
		return false;
	}

	function validatePassword(password: string): boolean {
		if (
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password) &&
			password.length > 7
		) {
			return true;
		}
		return false;
	}

	async function entrarApp() {
		let v = await validateFields(true);
		if (!v) return;

		if (!isLogin) {
			await createUsuario({
				id: "",
				nombre: nombre,
				email: email,
				contraseña: contraseña,
				ligas: [],
			});
		}
		const b = await setUsuarioAndRequestToken(email, contraseña);
		if (!b) {
			crearToast(
				"Ha habido un error. Por favor intentelo de nuevo más tarde",
				true
			);
		} else {
			navigate.push("/home", "forward");
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
							<IonButton expand="block" onClick={() => entrarApp()}>
								Entrar
							</IonButton>

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

export default Login;
