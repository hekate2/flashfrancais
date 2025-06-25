import fetch from "node-fetch";
import { promises as fs } from "fs";

const FORBIDDEN_TAGS = [
  "vulgar",
  "obsolete"
];

let conts = await fetch("https://raw.githubusercontent.com/hekate2/flashfrancais/refs/heads/main/donnees/mots.json");
if (!conts.ok) {
  throw new Error(await conts.text());
}
conts = await conts.json();

conts = conts.map((word) => {
  const headArgs = word?.head_templates?.[0]?.args || {};
  const tags = word?.senses?.[0]?.tags || [];

  let genre;

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

  return {
    mot: word.word,
    genre: genre,
    explication: word.senses?.[0]?.glosses || []
  };
}).filter((word) => !(!word.genre));

await fs.writeFile("donnees/mots_small.json", JSON.stringify(conts));