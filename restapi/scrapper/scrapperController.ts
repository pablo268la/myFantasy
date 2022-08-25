import axios from "axios";
import { RequestHandler } from "express";

// Obtaining products are unauthorized operations: everybody can list the products of the shop
export const getClasificacion: RequestHandler = async (req, res) => {
  axios
    .get(
      "https://api.sofascore.com/api/v1/unique-tournament/8/season/42409/standings/total"
    )
    .then((res) => {
      let teams = res.data.standings[0].rows;
      teams.forEach((team: any) => {
        console.log(team);
        console.log(team.team.name + " " + team.team.id);
      });
    })
    .catch((error) => {
      console.error(error);
    });
  return res.json();
};
