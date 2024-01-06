import express from "express";

const app = express();

const PORT = 5000;

// CREATE
app.post("/users", (req, res, next) => {
  res.json({ message: "User created" });
});

// READ
app.get("/users", (req, res, next) => {
  res.json({ message: "Users list" });
});

// UPDATE
app.patch("/users/:id", (req, res, next) => {
  const { id } = req.params;
  res.json({ message: `User ${id} updated` });
});

// DELETE
app.delete("/users/:id", (req, res, next) => {
  const { id } = req.params;
  res.json({ message: `User ${id} deleted` });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});
