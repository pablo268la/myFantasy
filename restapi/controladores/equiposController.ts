import { RequestHandler } from "express";
import { modeloEquipo } from "../model/equipo";

export const getEquipos: RequestHandler = async (req, res) => {
	res.json(await modeloEquipo.find());
};

export const getEquipo: RequestHandler = async (req, res) => {
	res.json(await modeloEquipo.find({ _id: req.params.id }));
};
