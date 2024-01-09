import express, { Request, Response, NextFunction } from "express";
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8000;

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

// 서버가 읽을 수 있도록 HTML 의 위치를 정의해줍니다.
app.use(express.static("public"));

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
