"use strict";

import express from "express";
import { promises as fs } from "fs";

const app = express();

// not good but i don't care
let mots = await fs.readFile("donnees/mots.json");
mots = JSON.parse(mots);

app.get("/mot", async (req, res) => {
  try {
    let infos = await choisirMot();

    res.json({
      "type": "success",
      "infos": infos
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({
      "type": "error",
      "message": err.message
    })
  }
})

async function choisirMot() {
  let motChoisi;
  let genre;

  while (!genre) {
    motChoisi = mots[Math.floor(Math.random() * mots.length)];

    if (["f", "m"].includes(motChoisi["head_templates"][0]["args"]["1"])) {
      genre = motChoisi["head_templates"][0]["args"]["1"];
    } else if (["f", "m"].includes(motChoisi["head_templates"][0]["args"]["g"])) {
      genre = motChoisi["head_templates"][0]["args"]["g"];
    }

    if (!genre) {
      // supprimmer le mot sans genre ou non-singulaires
      mots = mots.filter((m) => m["word"] !== motChoisi["word"]);
      await fs.writeFile("donnees/mots.json", JSON.stringify(mots));
    }
  }

  return {
    "mot": motChoisi["word"],
    "genre": genre
  }
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8080;
app.listen(PORT)