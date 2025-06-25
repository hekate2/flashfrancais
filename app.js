"use strict";

import express from "express";
import fetch from "node-fetch";

const app = express();

const FORBIDDEN_TAGS = [
  "vulgar",
  "obsolete"
];

let mots;

app.get("/mot", async (req, res) => {
  try {
    const infos = await choisirMot();
    res.json({ type: "success", infos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ type: "error", message: err.message });
  }
});

async function choisirMot() {
  let motChoisi;
  let genre;

  while (!genre) {
    motChoisi = mots[Math.floor(Math.random() * mots.length)];

    const headArgs = motChoisi?.head_templates?.[0]?.args || {};
    const tags = motChoisi?.senses?.[0]?.tags || [];

    if (["f", "m"].includes(headArgs["1"])) {
      genre = headArgs["1"];
    } else if (["f", "m"].includes(headArgs["g"])) {
      genre = headArgs["g"];
    } else if (tags.includes("feminine")) {
      genre = "f";
    } else if (tags.includes("masculine")) {
      genre = "m";
    }

    // better
    if (FORBIDDEN_TAGS.some(tag => tags.includes(tag))) {
      genre = null;
    }
  }

  return motChoisi
}

async function getWordData() {
  try {
    const path = "https://raw.githubusercontent.com/hekate2/flashfrancais/refs/heads/main/donnees/mots_small.json";
    const res = await fetch(path);
    // inline cuz I don't want a seperate functionnnnnn
    if (!res.ok) {
      throw new Error(await res.text());
    }
    mots = await res.json();
  } catch (err) {
    console.error("Failed to load mots.json:", err.message);
    process.exit(1);
  }
}


await getWordData();

app.use(express.static("public"));
const PORT = process.env.PORT || 8080;
app.listen(PORT);
