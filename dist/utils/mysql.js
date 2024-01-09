"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const mysql = promise_1.default.createConnection({
    host: "database-1.c8gvj9yivdfc.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "wpdwpd3dh0!",
    database: "lck4",
});
exports.default = mysql;
//# sourceMappingURL=mysql.js.map