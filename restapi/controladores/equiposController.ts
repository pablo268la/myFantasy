import { RequestHandler } from "express";
import { modeloEquipo } from "../model/equipo";

export const getEquipos: RequestHandler = async (req, res) => {
	res.json(await modeloEquipo.find());
};

export const getEquipo: RequestHandler = async (req, res) => {
	res.json(await modeloEquipo.findOne({ _id: req.params.idEquipo }));
};
