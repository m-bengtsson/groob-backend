import express from "express";
import {
   getItems,
   getItem,
   createItem,
   deleteItem,
   getUsers,
   getUser,
   createUser,
   updateUser
} from "./database.js";

const app = express();

app.use(express.json());

app.get("/items", async (req, res) => {
   const items = await getItems();
   res.send(items);
});

app.get("/items/:id", async (req, res) => {
   const id = req.params.id;
   const item = await getItem(id);
   res.send(item);
});

app.post("/items", async (req, res) => {
   console.log("BODY", req.body);
   const { title, body, created_by, number_of_items } = req.body;
   const created = await createItem(title, body, created_by, number_of_items);

   res.status(201).send(created);
});

app.delete("/items/:id", async (req, res) => {
   const id = req.params.id;
   const item = await deleteItem(id);

   //result.affectedRows will be 0 if item is not found
   if (item === 0) {
      res.sendStatus(400);
   }

   res.sendStatus(200);
});

app.get("/users", async (req, res) => {
   const users = await getUsers();
   res.send(users);
});

app.get("/users/:id", async (req, res) => {
   const id = req.params.id;
   const user = await getUser(id);
   res.send(user);
});

app.post("/users", async (req, res) => {

   const created = await createUser(req.body);

   res.status(201).send(created);
});

app.put("/users/:id", async (req, res) => {

   const id = req.params.id
   const updated = await updateUser(req.body, id);

   res.status(201).send(updated);
});


app.listen(8080, () => {
   console.log("Server running on port 8080");
});
