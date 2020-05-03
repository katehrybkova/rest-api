const express = require("express");
const path = require("path");
const app = express();
const { v4 } = require("uuid");

let CONTACTS = [
  {
    id: v4(),
    name: "Kate",
    value: "+380995556655",
    marked: false,
  },
];

app.use(express.json());

app.get("/api/contacts", (req, res) => {
  setTimeout(() => res.status(200).json(CONTACTS), 1000);
});

app.post("/api/contacts", (req, res) => {
  const contact = { ...req.body, id: v4(), marked: false };

  CONTACTS.push(contact);
  setTimeout(() => res.status(201).json(contact), 1000);
});

app.delete("/api/contacts/:id", (req, res) => {
  CONTACTS = CONTACTS.filter((c) => c.id !== req.params.id);
  res.status(200).json({ message: "Contact was deleted" });
});

app.put("/api/contacts/:id", (req, res) => {
  const idx = CONTACTS.findIndex((c) => c.id === req.params.id);
  CONTACTS[idx] = req.body;
  res.json(CONTACTS[idx]);
});

app.use(express.static(path.resolve(__dirname, "client")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

app.listen(3000, () => console.log("app is running on the port 3000"));
