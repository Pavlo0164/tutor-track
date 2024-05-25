import { Auth } from "./auth/auth.js";
import { Aside } from "./aside/aside.js";
const MAIN_CONTAINER = document.body

const auth = new Auth();

const aside = new Aside();
MAIN_CONTAINER.append(auth.el);
