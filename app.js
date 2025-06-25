"use strict";

import express from "express";
import fetch from "node-fetch";

const app = express();

let mots;

app.get("/mot", async (req, res) => {
  try {
    const infos = mots[Math.floor(Math.random() * mots.length)]

    res.json({ type: "success", infos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ type: "error", message: err.message });
  }
});

async function getWordData() {
  try {
    const path = "https://raw.githubusercontent.com/hekate2/flashfrancais/refs/heads/online/donnees/mots_small.json";
    const res = await fetch(path);
    // inline cuz I don't want a seperate functionnnnnn
    if (!res.ok) {
      throw new Error(await res.text());
    }
    mots = await res.json();

    console.log(mots.length);
  } catch (err) {
    console.error("Failed to load mots.json:", err.message);
    process.exit(1);
  }
}


await getWordData();

app.use(express.static("public"));
const PORT = process.env.PORT || 8080;
app.listen(PORT);
