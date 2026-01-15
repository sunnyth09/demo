import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "mysql",
  user: "root",
  password: "123456",
  database: "testdb"
});
