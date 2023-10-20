import pool from "./connection.js";

export const getItems = async () => {
	const [result] = await pool.query("SELECT * from items");
	return result;
};

export const getItem = async (id) => {
	const [result] = await pool.query("SELECT * FROM items WHERE item_id = ?", [
		id,
	]);
	return result[0];
	//returns undefined if the id does not exist
};

export const createItem = async (title, body, created_by, number_of_items) => {
	//change item_id later
	const item_id = Math.floor(Math.random() * 10000);
	await pool.query(
		"INSERT INTO items (item_id, title, body, created_by, number_of_items) VALUES (?, ?, ?, ?, ?)",
		[item_id, title, body, created_by, number_of_items]
	);
	//Get the newly created item
	return getItem(item_id);
};

export const deleteItem = async (id) => {
	const [result] = await pool.query("DELETE FROM items WHERE item_id = ?", [
		id,
	]);

	//result.affectedRows will be 0 if item is not found
	return result.affectedRows;
};

export const getUsers = async () => {
	const [result] = await pool.query("SELECT * from users");
	return result;
};

export const getUser = async (id) => {
	const [result] = await pool.query("SELECT * from users WHERE uid = ?", [id]);
	return result[0];
};

export const getUserByEmail = async (email) => {
	const [result] = await pool.query("SELECT * from users WHERE email = ?", [
		email,
	]);
	return result[0];
};

export const createUser = async ({ name, email, password }) => {
	const uid = Math.floor(Math.random() * 10000);
	await pool.query(
		"INSERT INTO users (uid, name, email, password) VALUES(?, ?, ?, ?)",
		[uid, name, email, password]
	);
	return getUser(uid);
};

export const updateUser = async (newValue, id) => {
	const result = Object.entries(newValue).map(
		async ([key, value]) =>
			await pool.query(`UPDATE users SET ${key} = ?  WHERE uid = ?`, [
				value,
				id,
			])
	);
	await Promise.all(result);
	return getUser(id);
};
