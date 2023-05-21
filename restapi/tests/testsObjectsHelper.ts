import * as jwt from "jsonwebtoken";
import { IUsuario } from "../model/usuario";

export const usuarioAdmin: IUsuario = {
	id: "d796014e-717f-4cd9-9f66-422546a0116b",
	nombre: "Test",
	usuario: "TestFantasy",
	email: "test@test.com",
	contraseña: "$2b$10$HCAC1lBDt/uypoJw5f/rCe.yd4q23BnJFNx.s53JVF/VuOkEXXmBC",
	ligas: [],
	admin: true,
};
export const tokenAdmin = jwt.sign(
	{ id: usuarioAdmin.id },
	process.env.JWT_SECRET || "secret"
);

export const usuario2: IUsuario = {
	id: "d796014e-717f-4cd9-9f66-422546a0116a",
	nombre: "Test2",
	usuario: "TestFantasy2",
	email: "test2@test.com",
	contraseña: "$2b$10$HCAC1lBDt/uypoJw5f/rCe.yd4q23BnJFNx.s53JVF/VuOkEXXmBC",
	ligas: [],
	admin: false,
};
export const token2 = jwt.sign(
	{ id: usuario2.id },
	process.env.JWT_SECRET || "secret"
);

export const usuario5Ligas: IUsuario = {
	id: "d796014e-717f-4cd9-9f66-422546a0116c",
	nombre: "Test3",
	usuario: "TestFantasy3",
	email: "test3@test.com",
	contraseña: "$2b$10$HCAC1lBDt/uypoJw5f/rCe.yd4q23BnJFNx.s53JVF/VuOkEXXmBC",
	ligas: ["1", "2", "3", "4", "5"],
	admin: false,
};
export const token5ligas = jwt.sign(
	{ id: usuario5Ligas.id },
	process.env.JWT_SECRET || "secret"
);

export const usuario4: IUsuario = {
	id: "d796014e-717f-4cd9-9f66-422546a0116d",
	nombre: "Test4",
	usuario: "TestFantasy4",
	email: "test4@test.com",
	contraseña: "$2b$10$HCAC1lBDt/uypoJw5f/rCe.yd4q23BnJFNx.s53JVF/VuOkEXXmBC",
	ligas: [],
	admin: false,
};
export const token4 = jwt.sign(
	{ id: usuario4.id },
	process.env.JWT_SECRET || "secret"
);
