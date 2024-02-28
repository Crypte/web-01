import { Router } from "./router";

import { WelcomeComponent } from "./welcome";
import { ScoreComponent } from "./score";
import { GameComponent } from "./game";

import "../../../node_modules/bootstrap/dist/css/bootstrap.css"
import "../styles/style.css";

// TODO #import-css: use ES side-effect imports to import styles/style.css

const outlet = document.querySelector("#content-outlet");
const router = new Router(outlet);
router
  .register("", {
    component: WelcomeComponent,
  })
  .register("welcome", {
    component: WelcomeComponent,
  })
  .register("game", {
    component: GameComponent,
  })
  .register("score", {
    component: ScoreComponent,
  });
