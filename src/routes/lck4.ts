import axios from "axios";
import express, { Request, Response, NextFunction } from "express";
import mysql from "../utils/mysql";
require("dotenv").config();
const crypto = require("crypto");
const router = express.Router();

router.get(
  "/:year/:month",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    const { year, month } = req.params;
    console.log(year);
    console.log(month);
    const mysqlConnect = await mysql;
    const [record] = await mysqlConnect.execute(`
    SELECT * FROM RECORD
  `);
    res.send(record);
  }
);

router.post("/lol", async (req: Request, res: Response, next: NextFunction) => {
  const userName = req.body.userName;
  const userInfo = await axios.get(
    `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userName}?api_key=${process.env.LOL_API_KEY}`
  );
  const rankInfo = await axios.get(
    `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userInfo.data.id}?api_key=${process.env.LOL_API_KEY}`
  );
  console.log(rankInfo.data);
  res.send(200);
});

module.exports = router;
