import mysql2 from "mysql2/promise";

const mysql = mysql2.createConnection({
  host: "database-1.c8gvj9yivdfc.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "wpdwpd3dh0!",
  database: "lck4",
});

export default mysql;
