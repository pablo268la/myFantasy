import { RequestHandler } from "express";
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
			const usuario = new modeloUsuario(req.body);
			const usuarioGuardado = await usuario.save();
			res.status(201).json(usuarioGuardado);
		} else {
			res.status(400).json({ message: "Usuario ya existe" });
		}
	} catch (error) {
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
