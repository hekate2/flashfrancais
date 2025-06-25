"use strict";
(function() {
  let currentGenre;
  let startTime;

  window.addEventListener("load", init);

  function init() {
    generateWordItem();
    makeButtons();

    document.getElementById("clear").addEventListener("click", () => {
      localStorage.removeItem("guessStats");
    });
  }

  function makeButtons() {
    let fButton = document.getElementById("f");
    let mButton = document.getElementById("m"); // je dis m

    fButton.addEventListener("click", () => guessGenre("f"));
    mButton.addEventListener("click", () => guessGenre("m")); // ya I could loop but I don't wanna

    document.addEventListener("keydown", (e) => {
      console.log(e.code);
      if (e.code == "KeyF") { // f key
        guessGenre("f");
      } else if (e.code == "KeyM") { // m key
        guessGenre("m");
      }
    })
  }

  function guessGenre(genre) {
    let card = document.getElementById("word-holder");

    // track stats
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const stats = JSON.parse(localStorage.getItem("guessStats")) || {
      totalTime: 0,
      guessCount: 0,
      numCorrect: 0
    };

    stats.totalTime += duration;
    stats.guessCount += 1;

    if (genre === currentGenre) {
      card.classList.add("correct");
      stats.numCorrect+= 1;
    } else {
      card.classList.add("wrong");
    }

    localStorage.setItem("guessStats", JSON.stringify(stats));

    document.getElementById("n-correcte").textContent = stats.numCorrect;
    document.getElementById("n-totale").textContent = stats.guessCount;

    if (stats.numCorrect / stats.guessCount <= .75) {
      // caution
      document.getElementById("ratio").classList.remove("mal");
      document.getElementById("ratio").classList.add("caution");
    } else if (stats.numCorrect / stats.guessCount <= .5) {
      // mal
      document.getElementById("ratio").classList.add("mal");
    } else {
      document.getElementById("ratio").classList.remove("mal");
      document.getElementById("ratio").classList.remove("caution");
    }

    const average = stats.totalTime / stats.guessCount;
    document.getElementById("temps").textContent = average + "s";

    startTime = null;

    setTimeout(() => {
      card.remove();
      generateWordItem();
    }, 2000);
  }

  async function generateWordItem() {
    try {
      let wordHolder = document.createElement("div");
      let wordText = document.createElement("h2");

      let word = await getWord();

      wordHolder.id = "word-holder";

      wordText.textContent = word.infos.mot;
      currentGenre = word.infos.genre;

      wordHolder.addEventListener("click", () => {
        wordHolder.classList.add("flip");
        wordText.textContent = "";

        setTimeout(() => {
          wordHolder.classList.remove("flip");
          wordText.textContent = wordHolder.classList.contains("def") ? word.infos.mot : word.infos.explication;
          wordHolder.classList.toggle("def");
        }, 500);
      });

      wordHolder.classList.add("card");
      wordHolder.appendChild(wordText);
      document.querySelector("main").appendChild(wordHolder);

      startTime = Date.now();
    } catch (err) {
      // whatever.  I'm like, totally over her anyways so who am I trying to impress?
      alert(err);
    }
  }

  async function getWord() {
    let res = await fetch("/mot");
    await statusCheck(res);
    res = await res.json();

    return res;
  }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }
})();