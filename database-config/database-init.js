import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

/* const dropUsersTables = async () => {
	pool.query(`DROP TABLE users`);
};

const dropItemsTables = async () => {
	pool.query(`DROP TABLE items`);
}; */

// Connect to the MySQL server
const createTableUsers = async () => {
	// Create the Customers table
	pool.query(
		`CREATE TABLE users (
      uid VARCHAR(36) NOT NULL,
      name VARCHAR(16) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(32) NOT NULL,
      role VARCHAR(45) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(36),
      updated_at TIMESTAMP NULL,
      updated_by VARCHAR(36),
      PRIMARY KEY (uid),
      UNIQUE INDEX uid_UNIQUE (uid ASC),
      UNIQUE INDEX email_UNIQUE (email),
      CONSTRAINT created_by
          FOREIGN KEY (created_by)
          REFERENCES groob.users (uid)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
      CONSTRAINT updated_by
          FOREIGN KEY (updated_by)
          REFERENCES groob.users (uid)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
  )`,
		(err) => {
			if (err) {
				console.error("Error creating Users table:", err);
			} else {
				console.log("Users table created");
			}
		}
	);
	createTableItems();
};

const createTableItems = () => {
	// Create the Customers table
	pool.query(
		`CREATE TABLE items(
      item_id VARCHAR(36) NOT NULL,
      title VARCHAR(36) NOT NULL,
      body TEXT NOT NULL,
      number_of_items INT NOT NULL,
      item_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      item_created_by VARCHAR(36) NOT NULL,
      item_updated_at TIMESTAMP NULL,
      item_updated_by VARCHAR(36),
      PRIMARY KEY (item_id),
      UNIQUE INDEX item_id_UNIQUE (item_id ASC),
      CONSTRAINT item_created_by
          FOREIGN KEY (item_created_by)
          REFERENCES groob.users (uid)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
      CONSTRAINT item_updated_by
          FOREIGN KEY (item_updated_by)
          REFERENCES groob.users (uid)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
  )`,
		(err) => {
			if (err) {
				console.error("Error creating items table:", err);
			} else {
				console.log("Items table created");
			}
		}
	);
};

/* await dropUsersTables(); */
await createTableUsers();
/* createTableItems(); */
/* await dropItemsTables(); */
