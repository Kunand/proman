import {dom} from "./dom.js";

// This function is to initialize the application
function init() {
    // init data
    const registerUsername = document.getElementById('register-username');
    const loginUsername = document.getElementById('login-username');

    if (registerUsername != null) {
        dom.register();
    } else if (loginUsername != null){
        dom.login();
    } else {
        dom.init();
        dom.loadBoards();
    }

    // let boardArray = document.querySelectorAll(".board");
    // let boards = Array.prototype.slice.call(boardArray);
    // dragula([boards]);
}

init();
