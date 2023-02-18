import * as bcrypt from "bcrypt";
import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import * as UUID from "uuid";
import { modeloUsuario } from "../model/usuario";

export const getUsuario: RequestHandler = async (req, res) => {
	try {
		const usuario = await modeloUsuario.findOne({ id: req.params.id });
		res.status(200).json(usuario);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getUsuarioByEmail: RequestHandler = async (req, res) => {
	try {
		const usuario = await modeloUsuario.findOne({ email: req.params.email });
		res.status(200).json(usuario);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createUsuario: RequestHandler = async (req, res) => {
	try {
		const find = await modeloUsuario.findOne({ email: req.body.email });
		const find2 = await modeloUsuario.findOne({ id: req.body.id });
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
		res.status(500).json(error);
	}
};

export const updateUsuario: RequestHandler = async (req, res) => {
	try {
		const usuario = await modeloUsuario.findOneAndUpdate(
			{ email: req.params.email },
			req.body,
			{ new: true }
		);
		res.status(200).json(usuario);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const requestToken: RequestHandler = async (req, res) => {
	try {
		const usuario = await modeloUsuario.findOne({ email: req.body.email });
		if (usuario) {
			const contraseñaCorrecta = await bcrypt.compare(
				req.body.contraseña,
				usuario.contraseña
			);

			if (contraseñaCorrecta) {
				const token = jwt.sign(
					{ id: usuario.id },
					process.env.JWT_SECRET || "secret"
				);
				res.status(200).json(token);
			} else {
				res.status(401).json({ message: "Contraseña incorrecta" });
			}
		} else {
			res.status(400).json({ message: "Usuario no existe" });
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

export const verifyToken: RequestHandler = async (req, res, next) => {
	try {
		const token = req.body.token;
		const email = req.body.email;

		if (!token || !email) {
			return res.status(400).json({ message: "Token o email no recibidos" });
		}

		const verified = await verifyUser(email, token);

		if (verified) {
			res.status(200).json({ message: "Token válido" });
		} else {
			res.status(401).json({ message: "No autorizado" });
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

export async function verifyUser(
	email: string,
	token: string
): Promise<boolean> {
	try {
		const payload: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
		const usuario = await modeloUsuario.findOne({ email: email });

		if (usuario !== null && payload.id === usuario.id) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}
