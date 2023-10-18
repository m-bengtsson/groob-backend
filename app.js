import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookies from "cookie-parser";
import {
   getItems,
   getItem,
   createItem,
   deleteItem,
   getUsers,
   getUser,
   createUser,
   updateUser,
   getUserByEmail,
} from "./database.js";
import authenticate from "./middleware/authenticate.js";

const app = express();

const secret_key = process.env.SECRET_KEY;

app.use(cookies());
app.use(
   cors({
      origin: "http://localhost:5173",
   })
);
app.use(express.json());

app.get("/items", authenticate, async (req, res) => {
   const items = await getItems();
   res.send(items);
});

app.get("/items/:id", async (req, res) => {
   const id = req.params.id;
   const item = await getItem(id);
   res.send(item);
});

app.post("/items", async (req, res) => {
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
   const id = req.params.id;
   const updated = await updateUser(req.body, id);

   res.status(201).send(updated);
});

app.post("/api/identity/login", async (req, res) => {
   const { email, password } = req.body;
   const user = await getUserByEmail(email);

   if (user.password === password) {
      const accessToken = jwt.sign({ email }, secret_key, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ email }, secret_key, { expiresIn: "1d" });

      res
         .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
         })
         .header("Authorization", accessToken)
         .send(email);
   }
});

app.post("/api/identity/refresh", async (req, res) => {
   const refreshToken = req.cookies["refreshToken"];

   if (!refreshToken) {
      return res.status(401).send("Neej va synd, du hade ingen refreshtoken :/");
   }
   try {
      const decoded = jwt.verify(refreshToken, secret_key);
      const accessToken = jwt.sign({ email: decoded.email }, secret_key, {
         expiresIn: "15m",
      });
      res.status(200).header("Authorization", accessToken).send(decoded.email);
   } catch (error) {
      res.status(401).send("Neej va synd du får ingen ny token :'(")
   }
});

app.listen(8080, () => {
   console.log("Server running on port 8080");
});
