import { parseUrl } from "./utils";
import template from "../views/game.html";
import { Component } from "./component";

import back from "/src/assets/cards/back.png";
import card0 from "/src/assets/cards/card-0.png";
import card1 from "/src/assets/cards/card-1.png";
import card2 from "/src/assets/cards/card-2.png";
import card3 from "/src/assets/cards/card-3.png";
import card4 from "/src/assets/cards/card-4.png";
import card5 from "/src/assets/cards/card-5.png";
import card6 from "/src/assets/cards/card-6.png";
import card7 from "/src/assets/cards/card-7.png";
import card8 from "/src/assets/cards/card-8.png";
import card9 from "/src/assets/cards/card-9.png";


var CARD_TEMPLATE = ""
  .concat('<main class="card-cmp">')
  .concat('  <div class="card-wrapper">')
  .concat('    <img class="card front-face" alt="card" />')
  .concat('    <img class="card back-face" alt="card" />')
  .concat("  </div>")
  .concat("</main>");

  var environment = {
    api: {
      host: "http://localhost:8081",
    },
  };



  export class GameComponent extends Component {
    constructor(){

  
    super(template)
    // gather parameters from URL
    var params = parseUrl();

    this.template = template;
    // save player name & game ize
    this._name = params.name;
    this._size = parseInt(params.size) || 9;
    this._flippedCard = null;
    this._matchedPairs = 0;
  } 

  init() {
    // fetch the cards configuration from the server
    this.fetchConfig(config => {
      this._config = config;
      this._boardElement = document.querySelector(".cards");

      // create cards out of the config
      this._cards = this._config.ids.map(id => new CardComponent(id));

      // append cards to the board
      this._cards.forEach(card => {
        this._appendCard(card);
      });

      this.start();
    });
  }

  _appendCard(card) {
    this._boardElement.appendChild(card.getElement());
  
    card.getElement().addEventListener(
      "click",
      () => {
        this._flipCard(card);
      }
    );
  }


  start() {
    this._startTime = Date.now();
    let seconds = 0;
    // Using template literals
    document.querySelector("nav .navbar-title").textContent =
      `Player: ${this._name}. Elapsed time: ${seconds++}`;
  
    this._timer = setInterval(() => {
      // Using template literals
      document.querySelector("nav .navbar-title").textContent =
        `Player: ${this._name}. Elapsed time: ${seconds++}`;
    }, 1000);
  }

  fetchConfig(cb) {
    const xhr = typeof XMLHttpRequest !== "undefined" ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  
    // Using template literals
    xhr.open("get", `${environment.api.host}/board?size=${this._size}`, true);
  
    // Using arrow function
    xhr.onreadystatechange = () => {
      let status;
      let data;
      // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
      if (xhr.readyState === 4) {
        // `DONE`
        status = xhr.status;
        if (status === 200) {
          data = JSON.parse(xhr.responseText);
          cb(data);
        } else {
          throw new Error(status);
        }
      }
    };
    xhr.send();
  }

  goToScore() {
    const timeElapsedInSeconds = Math.floor((Date.now() - this._startTime) / 1000);
    clearInterval(this._timer);
  
    setTimeout(() => {
      const scorePage = "./#score";
      // Using template literals
      window.location = `${scorePage}?name=${this._name}&size=${this._size}&time=${timeElapsedInSeconds}`;
    }, 750);
  }

  _flipCard(card) {
    if (this._busy || card.flipped) {
      return;
    }
  
    // Flip the card
    card.flip();
  
    // If flipped first card of the pair
    if (!this._flippedCard) {
      // Keep this card flipped and wait for the second card of the pair
      this._flippedCard = card;
    } else {
      // Second card of the pair flipped...
  
      // If cards are the same
      if (card.equals(this._flippedCard)) {
        this._flippedCard.matched = true;
        card.matched = true;
        this._matchedPairs += 1;
  
        // Reset flipped card for the next turn.
        this._flippedCard = null;
  
        if (this._matchedPairs === this._size) {
          this.goToScore();
        }
      } else {
        this._busy = true;
  
        // Cards did not match
        // Wait a short amount of time before hiding both cards
        setTimeout(() => {
          // Hide the cards
          this._flippedCard.flip();
          card.flip();
          this._busy = false;
  
          // Reset flipped card for the next turn.
          this._flippedCard = null;
        }, 500);
      }
    }
  }
  
  
}
  

  // TODO #card-component: Change images location to /app/components/game/card/assets/***.png
  var CARDS_IMAGE = [
    back,
    card0,
    card1,
    card2,
    card3,
    card4,
    card5,
    card6,
    card7,
    card8,
    card9,
  ];


  /* class CardComponent constructor */
  class CardComponent extends Component {
    constructor(id){
    super(template)
   
    // is this card flipped?
    this._flipped = false;
    this.template = CARD_TEMPLATE;

    // has the matching card has been discovered already?
    this.matched = false;

    this._elt = document.createElement("div");
    this._elt.innerHTML = this.template;
    this._elt = this._elt.firstElementChild;
    this._id = id;

    this._imageElt = this.getElement().querySelector(".card-wrapper");
    this._imageElt.querySelector("img.front-face").src =
      CARDS_IMAGE[this._id + 1];
    this._imageElt.querySelector("img.back-face").src = CARDS_IMAGE[0];
  }


  /* method CardComponent.getElement */
 getElement() {
    return this._elt;
  };

  flip() {
    this._imageElt.classList.toggle("flip");
    this._flipped = !this._flipped;
  };

  equals(card) {
    return card._id === this._id;
  };

  get flipped(){
    return this._flipped;
  }
}
