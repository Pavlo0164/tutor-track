import { Auth } from "./auth/auth.js";
import { Aside } from "./aside/aside.js";
import { Main } from "./main/main.js";
const MAIN_CONTAINER = document.body;

const auth = new Auth();

const main = new Main();
MAIN_CONTAINER.append(main.el);
