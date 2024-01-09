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
const mysql_1 = __importDefault(require("../utils/mysql"));
require("dotenv").config();
const crypto = require("crypto");
const router = express_1.default.Router();
router.get("/:year/:month", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const { year, month } = req.params;
    console.log(year);
    console.log(month);
    const mysqlConnect = yield mysql_1.default;
    const [record] = yield mysqlConnect.execute(`
    SELECT * FROM RECORD
  `);
    res.send(record);
}));
router.post("/lol", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.userName;
    const userInfo = yield axios_1.default.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${userName}?api_key=${process.env.LOL_API_KEY}`);
    const rankInfo = yield axios_1.default.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userInfo.data.id}?api_key=${process.env.LOL_API_KEY}`);
    console.log(rankInfo.data);
    res.send(200);
}));
module.exports = router;
//# sourceMappingURL=lck4.js.map