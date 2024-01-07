import express from "express";
import prisma from "./lib/prisma";

const app = express();
app.use(express.json());

// CREATE
app.post("/users", async (req, res, next) => {
  const { name, email, address } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      address,
    },
  });
  res.json({ message: "User created!", data: user });
});

// READ MANY
app.get("/users", async (req, res, next) => {
  const users = await prisma.user.findMany();
  res.json({ message: "User list", data: users });
});

// READ SINGLE
app.get("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  res.json({ message: `User with id ${id} found`, data: user });
});

// UPDATE
app.patch("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  const { email, name, address } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { email, name, address },
  });
  res.json({ message: `User with id ${id} updated`, data: user });
});

// DELETE
app.delete("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.delete({ where: { id } });
  res.json({ message: `User with id ${id} deleted`, data: user });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});
