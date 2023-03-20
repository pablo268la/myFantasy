import { RequestHandler } from "express";
import { modeloPartido } from "../model/partido";

export const getPartidos: RequestHandler = async (req, res) => {
	try {
		res.status(200).json(await modeloPartido.find());
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getPartido: RequestHandler = async (req, res) => {
	try {
		const partido = await modeloPartido.findById(req.params.id);
		if (!partido)
			return res.status(404).json({ message: "Partido no encontrado" });
		return res.status(200).json(partido);
	} catch (error) {
		res.status(500).json(error);
	}
};
