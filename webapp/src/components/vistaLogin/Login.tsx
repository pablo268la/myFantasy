import {
	IonButton,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonLoading,
	IonNote,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar,
	useIonRouter,
	useIonToast,
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { useEffect, useState } from "react";
import { createUsuario, getUsuario } from "../../endpoints/userEndpoints";
import {
	getUsuarioLogueado,
	setUsuarioAndRequestToken,
} from "../../helpers/helpers";

type LoginProps = {};

function Login(props: LoginProps): JSX.Element {
	const navigate = useIonRouter();

	const [email, setEmail] = useState<string>("");
	const [contraseña, setContraseña] = useState<string>("");
	const [repPassword, setRepPassword] = useState<string>("");
	const [nombre, setNombre] = useState<string>("");
	const [nombreUsuario, setNombreUsuario] = useState<string>("");
	const [isLogin, setIsLogin] = useState<boolean>(true);

	const [present] = useIonToast();
	function crearToast(mensaje: string, mostrarToast: boolean, color: string) {
		if (mostrarToast)
			present({
				color: color,
				message: mensaje,
				duration: 1500,
			});
	}

	useEffect(() => {}, []);

	const [showLoading, setShowLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>();

	async function validateFields(mostrarToast: boolean): Promise<boolean> {
		if (email === "" || contraseña === "") {
			crearToast(
				"Por favor, rellena todos los campos",
				mostrarToast,
				"warning"
			);
			return false;
		}

		if (!validateEmail(email)) {
			crearToast("Formato de email incorrecto", mostrarToast, "warning");
			return false;
		}

		if (!isLogin) {
			if (nombre.length < 1) {
				crearToast("El nombre no puede estar vacio", mostrarToast, "warning");
				return false;
			}

			if (nombreUsuario.length < 1) {
				crearToast(
					"El nombre de usuario no puede estar vacio",
					mostrarToast,
					"warning"
				);
				return false;
			}

			if (!validatePassword(contraseña)) {
				crearToast(
					"La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
					mostrarToast,
					"warning"
				);
				return false;
			}

			if (contraseña !== repPassword) {
				crearToast("Las contraseñas no coinciden", mostrarToast, "warning");
				return false;
			}
		}

		return await getUsuario(email)
			.then((u) => {
				if (isLogin) {
					if (u !== null) {
						return true;
					} else {
						crearToast(
							"Email o contraseña incorrectos",
							mostrarToast,
							"danger"
						);
						return false;
					}
				} else {
					if (u !== null) {
						crearToast("El email ya está en uso", mostrarToast, "danger");
						return false;
					} else {
						return true;
					}
				}
			})
			.catch((err) => {
				if (err.toString() === "Error: Usuario no encontrado") return true;
				crearToast(err.message, true, "danger");
				return false;
			});
	}

	function validateEmail(email: string): boolean {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			return true;
		}
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
		setMessage("Validando datos...");
		let v = await validateFields(true).then((v) => {
			if (!v) {
				return false;
			}
			setShowLoading(true);
			return true;
		});

		if (!v) {
			return;
		}

		if (!isLogin) {
			setMessage("Creando usuario...");
			await createUsuario({
				id: "",
				nombre: nombre,
				usuario: nombreUsuario,
				email: email,
				contraseña: contraseña,
				ligas: [],
				admin: false,
			})
				.then(() => {
					crearToast("Usuario creado correctamente", true, "success");
				})
				.catch((error) => {
					setShowLoading(false);
					crearToast(error.message, true, "danger");
					return;
				});
		}

		setMessage("Iniciando sesión...");
		setShowLoading(true);
		await setUsuarioAndRequestToken(email, contraseña)
			.then(() => {
				crearToast(
					"Bienvenido " + getUsuarioLogueado()?.nombre,
					true,
					"success"
				);
				setShowLoading(false);
				navigate.push("/home", "forward");
			})
			.catch((error) => {
				crearToast(error.message, true, "danger");
				setShowLoading(false);
			});
		setShowLoading(false);
	}

	return (
		<>
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Headline Coach</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonLoading isOpen={showLoading} message={message} />
				<IonContent style={{ justifyContent: "center" }}>
					<IonGrid style={{ maxWidth: 500 }}>
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
										<IonItem>
											<IonLabel position="floating">Nombre de usuario</IonLabel>
											<IonInput
												value={nombreUsuario}
												onIonChange={(e) => {
													setNombreUsuario(e.detail.value!.trim());
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
											<IonLabel position="floating">
												{" "}
												Repetir contraseña
											</IonLabel>
											<IonInput
												type="password"
												value={repPassword}
												onIonChange={(e) => {
													setRepPassword(e.detail.value!.trim());
												}}
											></IonInput>
											<IonNote slot="error">
												Las contraseñas no coinciden
											</IonNote>
										</IonItem>
									</>
								) : (
									<></>
								)}
							</IonCol>
						</IonRow>
						<IonRow>
							<IonCol>
								{isLogin ? (
									<>
										<IonButton expand="block" onClick={() => entrarApp()}>
											Entrar
										</IonButton>
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
									</>
								) : (
									<>
										<IonButton expand="block" onClick={() => entrarApp()}>
											Crear cuenta
										</IonButton>
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
									</>
								)}
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonContent>
			</IonPage>
		</>
	);
}

export default Login;
