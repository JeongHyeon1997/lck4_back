import express, { Request, Response, NextFunction } from "express";
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8000;

const corsOptions = {
  origin: [
    "https://www.lck4.lol",
    "https://lck4.lol",
    "http://localhost:3000",
    "http://1.220.213.141:3000", // 시드 스터디카페
  ],
  methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  credentials: true, // 헤더에 'Access-Control-Allow-Credentials: true'를 추가합니다.
  allowedHeaders:
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// 서버가 읽을 수 있도록 HTML 의 위치를 정의해줍니다.
app.use(express.static("public"));

const lck4 = require("./routes/lck4");

app.use("/lck4", lck4);

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("LCK 4부 리그 API");
});

app.listen(port, () => {
  console.log(`
    #############################################
        🛡️ Server listening on port: 8000 🛡️
    #############################################    
    `);
});
