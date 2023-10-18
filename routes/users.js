import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
   getUsers,
   getUser,
   createUser,
   updateUser,
} from "../database.js";

const router = express.Router()

router.use(authenticate);

router.get("/", async (req, res) => {
   const users = await getUsers();
   res.send(users);
});

router.get("/:id", async (req, res) => {
   const id = req.params.id;
   const user = await getUser(id);
   res.send(user);
});

router.post("/", async (req, res) => {
   const created = await createUser(req.body);

   res.status(201).send(created);
});

router.put("/:id", async (req, res) => {
   const id = req.params.id;
   const updated = await updateUser(req.body, id);

   res.status(201).send(updated);
});

export default router;