import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import itemsRoute from "./routes/items.js"
import usersRoute from "./routes/users.js"
import identityRoute from "./routes/identity.js"

const app = express();

app.use(cookies());
app.use(
   cors({
      origin: "http://localhost:5173",
   })
);
app.use(express.json());
app.use("/api/items", itemsRoute)
app.use("/api/users", usersRoute)
app.use("/api/identity", identityRoute)


app.listen(8080, () => {
   console.log("Server running on port 8080");
});
