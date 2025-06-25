"use strict";

import express from "express";
import { promises as fs } from "fs";
import path from "path";

const app = express();

const FORBIDDEN_TAGS = [
  "vulgar",
  "obsolete"
]


// not good but i don't care
let pathToMots = path.join(process.cwd(), "donnees", 'mots.json');
let mots = await fs.readFile(pathToMots);
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
    } else if (motChoisi["senses"][0]["tags"]?.includes("feminine")) {
      genre = "f";
    } else if (motChoisi["senses"][0]["tags"]?.includes("masculine")) {
      genre = "m";
    }

    FORBIDDEN_TAGS.forEach((tag) => {
      if (motChoisi["senses"][0]["tags"]?.includes(tag)) {
        // quick fix to have it be deleted
        genre = null;
      }
    });

    if (!genre) {
      // supprimmer le mot sans genre ou non-singulaires
      mots = mots.filter((m) => m["word"] !== motChoisi["word"]);
      await fs.writeFile(pathToMots, JSON.stringify(mots));
    }
  }

  return {
    "mot": motChoisi["word"],
    "genre": genre,
    "explication": motChoisi["senses"][0]["glosses"]
  }
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8080;
app.listen(PORT)