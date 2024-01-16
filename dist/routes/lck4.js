"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const getHighTier_1 = require("../utils/getHighTier");
const mysql_1 = __importDefault(require("../utils/mysql"));
require("dotenv").config();
const crypto = require("crypto");
const router = express_1.default.Router();
router.post("/lol", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.userName;
    const mysqlConnect = yield mysql_1.default;
    const userInfo = yield axios_1.default.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userName}?api_key=${process.env.LOL_API_KEY}`);
    const rankInfo = yield axios_1.default.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userInfo.data.id}?api_key=${process.env.LOL_API_KEY}`);
    console.log(rankInfo.data);
    const browser = yield puppeteer_1.default.launch({ headless: "new" });
    const page = yield browser.newPage();
    yield page.goto(`https://fow.kr/find/${userName}`);
    const result = yield page.evaluate(() => {
        const contentContainer = document.querySelector("#content-container > div:nth-child(1) > div:nth-child(2) > div.topp > div.profile > div:nth-child(3)");
        return contentContainer.textContent;
    });
    yield browser.close();
    const highTier = (0, getHighTier_1.getHighTier)(result);
    const tier = rankInfo.data.length === 0 ? "UNRANKED" : "UNRANKED";
    const currentDate = new Date();
    yield mysqlConnect
        .query(`
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
  `)
        .then((data) => {
        res.sendStatus(200);
    });
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mysqlConnect = yield mysql_1.default;
        const [userList] = yield mysqlConnect.execute(`
    SELECT
      *
    FROM
      USER
  `);
        res.send(userList);
    }
    catch (e) {
        throw e;
    }
}));
router.get("/record/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const mysqlConnect = yield mysql_1.default;
        const [record] = yield mysqlConnect.execute(`
      SELECT
        *
      FROM
        RECORD
      WHERE
        id = ${id};
    `);
        res.send(record);
    }
    catch (e) {
        throw e;
    }
}));
router.get("/record/match/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const mysqlConnect = yield mysql_1.default;
        const [match] = yield mysqlConnect.execute(`
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
        RecordId = ${id};
    `);
        res.send(match);
    }
    catch (e) {
        throw e;
    }
}));
router.get("/:year/:month", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.params;
        const formatMonth = month.length === 1 ? `0${month}` : month;
        const mysqlConnect = yield mysql_1.default;
        const [record] = yield mysqlConnect.execute(`
      SELECT
        *
      FROM
        RECORD
      WHERE
        DATE_FORMAT(startDate, '%Y%m') = '${year}${formatMonth}';
    `);
        res.send(record);
    }
    catch (e) {
        throw e;
    }
}));
module.exports = router;
//# sourceMappingURL=lck4.js.map