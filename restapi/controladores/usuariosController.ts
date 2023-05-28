import * as bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import * as UUID from "uuid";
import { IUsuario, modeloUsuario } from "../model/usuario";

export const getUsuario: RequestHandler = async (req, res) => {
	try {
		const usuario = await modeloUsuario.findOne({ email: req.params.email });
		if (!usuario)
			return res.status(404).json({ message: "Usuario no encontrado" });

		res.status(200).json(usuario);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const createUsuario: RequestHandler = async (req, res) => {
	try {
		const find = await modeloUsuario.findOne({
			email: req.body.email.toString(),
		});
		const find2 = await modeloUsuario.findOne({ id: req.body.id.toString() });
		if (!find && !find2) {
			let usuario = new modeloUsuario(req.body);
			usuario.contraseña = await bcrypt.hash(usuario.contraseña, 10);
			usuario.id = UUID.v4();
			const usuarioGuardado = await usuario.save();
			res.status(201).json(usuarioGuardado);
		} else {
			res.status(409).json({ message: "Usuario ya existe" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const requestToken: RequestHandler = async (req, res) => {
	try {
		const usuario = await modeloUsuario.findOne({
			email: req.body.email.toString(),
		});
		if (usuario) {
			const token = requestJWTToken(usuario, req.body.contraseña);
			if (token !== "") {
				res.status(200).json(token);
			} else {
				res.status(401).json({ message: "Contraseña incorrecta" });
			}
		} else {
			res.status(404).json({ message: "Usuario no existe" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export function requestJWTToken(usuario: IUsuario, contraseña: string): string {
	const contraseñaCorrecta = bcrypt.compareSync(contraseña, usuario.contraseña);
	if (contraseñaCorrecta) {
		return jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || "secret");
	} else {
		return "";
	}
}

export async function verifyUser(
	email: string,
	token: string
): Promise<boolean> {
	try {
		const payload: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
		const usuario = await modeloUsuario.findOne({ email: email.toString() });
		if (usuario === null || payload.id !== usuario.id) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		return false;
	}
}
