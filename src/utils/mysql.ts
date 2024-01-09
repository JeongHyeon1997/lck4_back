import mysql2 from "mysql2/promise";

const mysql = mysql2.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
});

export default mysql;
