import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql
   .createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
   })
   .promise();

export const getItems = async () => {
   const [rows] = await pool.query("SELECT * from items");
   return rows;
};

//Using ? instead of value directly, the id is an untrusted value and we don't want it to be part of the query.
//Send id seperately as an array
//Otherwise it could lead to SQL injection attacks
// syntax is called prepared statement
export const getItem = async (id) => {
   const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);
   return rows[0]; //Want the first object in the array
   //returns undefined if the id does not exist
};

export const createItem = async (title, body, created_by, number_of_items) => {
   const [result] = await pool.query(
      "INSERT INTO items (title, body, created_by, number_of_items) VALUES (?, ?, ?, ?)",
      [title, body, created_by, number_of_items]
   );
   const id = result.insertId;

   //Get the newly created item
   return getItem(id);
};
