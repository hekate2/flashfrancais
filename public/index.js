"use strict";
(function() {
  let currentGenre;

  window.addEventListener("load", init);

  function init() {
    generateWordItem();
    makeButtons();
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

    if (genre === currentGenre) {
      card.classList.add("correct");
    } else {
      card.classList.add("wrong");
    }

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
      console.log(word);
      currentGenre = word.infos.genre;

      wordHolder.classList.add("card");
      wordHolder.appendChild(wordText);
      document.querySelector("main").appendChild(wordHolder);
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