import axios from "axios";
import express, { Request, Response, NextFunction } from "express";
import mysql from "../utils/mysql";
require("dotenv").config();
const crypto = require("crypto");
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send([
    {
      firstTeam: "Team 감자",
      firstTeamWin: 0,
      secondTeam: "Team 정현",
      secondTeamWin: 0,
      state: "진행",
      startDate: "01.01(월)",
      startTime: "17:00",
    },
    {
      firstTeam: "Team 감자",
      firstTeamWin: 1,
      secondTeam: "Team 정현",
      secondTeamWin: 0,
      state: "종료",
      startDate: "01.02(월)",
      startTime: "17:00",
    },
    {
      firstTeam: "Team 감자",
      firstTeamWin: 0,
      secondTeam: "Team 정현",
      secondTeamWin: 1,
      state: "예정",
      startDate: "01.02(월)",
      startTime: "17:00",
    },
    {
      firstTeam: "Team 감자",
      firstTeamWin: 2,
      secondTeam: "Team 정현",
      secondTeamWin: 1,
      state: "종료",
      startDate: "02.02(월)",
      startTime: "17:00",
    },
    {
      firstTeam: "Team 감자",
      firstTeamWin: 0,
      secondTeam: "Team 정현",
      secondTeamWin: 0,
      state: "종료",
      startDate: "02.02(월)",
      startTime: "17:00",
    },
  ]);
});

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
