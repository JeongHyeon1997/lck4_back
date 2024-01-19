import axios from "axios";
import express, { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer";
import { getHighTier } from "../utils/getHighTier";
import mysql from "../utils/mysql";
require("dotenv").config();
const crypto = require("crypto");
const router = express.Router();

router.post("/lol", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.body.userName;
    const tag = req.body.tag.replace("#", "");
    const password = req.body.password;
    const mysqlConnect = await mysql;
    const userInfo = await axios.get(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userName}?api_key=${process.env.LOL_API_KEY}`
    );
    const rankInfo = await axios.get(
      `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userInfo.data.id}?api_key=${process.env.LOL_API_KEY}`
    );

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(`https://fow.kr/find/${userName}-${tag}`);

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
          , password
          , highTier
          , tier
          , win
          , loss
          , rate
          , updateDate
          , createDate
        ) VALUES (
          ${userInfo.data.summonerLevel}
          , '${userInfo.data.name}'
          , '${highTier}'
          , '${tier}'
          , '${password}'
          , 0
          , 0
          ,'0'
          , null
          , '${currentDate.toISOString().slice(0, 19).replace("T", " ")}'
        )
    `
      )
      .then((data) => {
        res.sendStatus(200);
      });
  } catch (e) {
    res.sendStatus(500);
    throw e;
  }
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
        , u1.name as fristTeamUserName
        , "챔피언" as fristTeamUserChampion
        , m.firstTeamUserMVP as fristTeamUserMVP
        , u2.name as secondTeamUserName
        , "챔피언" as secondTeamUserChampion
        , m.secondTeamUserMVP as secondTeamUserMVP
        , m.Line as Line
        , m.CreateDate as CreateDate
      FROM
        MACTH m
      LEFT OUTER JOIN RECORD r ON m.RecordId = r.id
      LEFT OUTER JOIN USER u1 ON u1.id = m.firstTeamUserId
      LEFT OUTER JOIN USER u2 ON u2.id = m.secondTeamUserId
      WHERE
        RecordId = ${id}
        ORDER BY
      CASE m.Line
          WHEN 'TOP' THEN 1
          WHEN 'JG' THEN 2
          WHEN 'MID' THEN 3
          WHEN 'AD' THEN 4
          WHEN 'SUP' THEN 5
          ELSE 6
      END;
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

router.put(
  "/user/update",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mysqlConnect = await mysql;
      const currentDate = new Date();
      const [update] = await mysqlConnect.execute(`
      UPDATE USER
      SET
        level = '${req.body.level}'
        , name = '${req.body.name}'
        , password = '${req.body.password}'
        , highTier = '${req.body.highTier}'
        , tier = '${req.body.tier}'
        , win = '${req.body.win}'
        , loss = '${req.body.loss}'
        , rate = '${req.body.rate}'
        , updateDate = '${currentDate
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}'
      WHERE
        id = ${req.body.id}
  `);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
      throw e;
    }
  }
);

module.exports = router;
