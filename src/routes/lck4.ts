import axios from "axios";
import express, { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer";
import { getHighTier } from "../utils/getHighTier";
import mysql from "../utils/mysql";
require("dotenv").config();
const crypto = require("crypto");
const router = express.Router();

router.post("/lol", async (req: Request, res: Response, next: NextFunction) => {
  const userName = req.body.userName;
  const mysqlConnect = await mysql;
  const userInfo = await axios.get(
    `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userName}?api_key=${process.env.LOL_API_KEY}`
  );
  const rankInfo = await axios.get(
    `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userInfo.data.id}?api_key=${process.env.LOL_API_KEY}`
  );
  console.log(rankInfo.data);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(`https://fow.kr/find/${userName}`);

  const result = await page.evaluate(() => {
    const contentContainer = document.querySelector(
      "#content-container > div:nth-child(1) > div:nth-child(2) > div.topp > div.profile > div:nth-child(3)"
    );
    return contentContainer.textContent;
  });

  await browser.close();

  const highTier = getHighTier(result);
  const tier = rankInfo.data.length === 0 ? "UNRANKED" : "UNRANKED";
  const currentDate = new Date();
  await mysqlConnect
    .query(
      `
      INSERT INTO USER (
        level
        , name
        , highTier
        , tier
        , win
        , loss
        , rate
        , createDate
      ) VALUES (
        ${userInfo.data.summonerLevel}
        , '${userInfo.data.name}'
        , '${highTier}'
        , '${tier}'
        , 0
        , 0
        ,'0'
        , '${currentDate.toISOString().slice(0, 19).replace("T", " ")}'
      )
  `
    )
    .then((data) => {
      res.sendStatus(200);
    });
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mysqlConnect = await mysql;
    const [userList] = await mysqlConnect.execute(`
    SELECT
      *
    FROM
      USER
  `);
    res.send(userList);
  } catch (e) {
    throw e;
  }
});

router.get(
  "/record/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const mysqlConnect = await mysql;
      const [record] = await mysqlConnect.execute(`
      SELECT
        *
      FROM
        RECORD
      WHERE
        id = ${id};
    `);
      res.send(record);
    } catch (e) {
      throw e;
    }
  }
);

router.get(
  "/record/match/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const mysqlConnect = await mysql;
      const [match] = await mysqlConnect.execute(`
      SELECT
        m.id as id
        , "닉네임" as fristTeamUser
        , "닉네임" as secondTeamUser
        , "챔피언" as Champion
        , m.Line as Line
        , m.MVP as MVP
        , m.CreateDate as CreateDate
      FROM
        MACTH m
      LEFT OUTER JOIN RECORD r ON m.RecordId = r.id
      WHERE
        RecordId = ${id};
    `);
      res.send(match);
    } catch (e) {
      throw e;
    }
  }
);

router.get(
  "/:year/:month",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year, month } = req.params;
      const formatMonth = month.length === 1 ? `0${month}` : month;
      const mysqlConnect = await mysql;
      const [record] = await mysqlConnect.execute(`
      SELECT
        *
      FROM
        RECORD
      WHERE
        DATE_FORMAT(startDate, '%Y%m') = '${year}${formatMonth}';
    `);
      res.send(record);
    } catch (e) {
      throw e;
    }
  }
);

module.exports = router;
