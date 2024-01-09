import express, { Request, Response, NextFunction } from "express";
import mysql from "../utils/mysql";
require("dotenv").config();
const crypto = require("crypto");
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("hi");
});
