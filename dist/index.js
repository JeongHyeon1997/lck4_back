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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8000;
const corsOptions = {
    origin: [
        "https://www.lck4.lol",
        "https://lck4.lol",
        "http://localhost:3000",
        "http://1.220.213.141:3000", // location : Seed
        "http://114.199.130.61:3000", // location : potato house
    ],
    methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    credentials: true,
    allowedHeaders: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express_1.default.static("public"));
const lck4 = require("./routes/lck4");
app.use("/lck4", lck4);
app.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("LCK 4부 리그 API");
}));
app.listen(port, () => {
    console.log(`
    #############################################
        🛡️ Server listening on port: 8000 🛡️
    #############################################    
    `);
});
//# sourceMappingURL=index.js.map