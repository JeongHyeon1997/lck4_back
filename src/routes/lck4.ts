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

module.exports = router;
