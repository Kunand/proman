// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
            for (let board of boards) {
                dom.loadStatuses(board.id);
            }
        });
    },
    showBoards: function (boards) {
        let boardList = '';

        for (let board of boards) {
            boardList += `
                <section class="board" data-id="${board.id}">
                    <div class="board-header">
                        <span class="board-title">${board.title}
                            <div class="board-remove"><i class="fas fa-trash-alt"></i></div>
                        </span>
                        
                        <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                    </div>
                </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        dom.initAddCardButtons();
        dom.initAddBoardButton()
        dom.initRenameBoardTitle();
        dom.deletePublicBoard();
    },

    loadStatuses: function (boardId) {
        dataHandler.getStatusesByBoardId(boardId, function (statuses) {
            dom.showStatuses(statuses, boardId);
            for (let status of statuses) {
                dom.loadCards(status.id);
            }
        });
    },
    showStatuses: function (statuses, boardId) {
        let statusList = '';

        for (let status of statuses) {
            statusList += `
               <div class="board-column" data-status-id="${status.id}">
                    <div class="board-column-title">${status.title}
                        <div class="status-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="board-add"><i class="fas fa-plus-square"></i></div>
                    </div>
               </div>
            `;
        }
        const outerHtml = `
            <div class="board-columns">
                ${statusList}
            </div>
        `;

        let board = document.querySelector(`[data-id='${boardId}']`);
        board.insertAdjacentHTML("beforeend", outerHtml);
        dom.deletePublicStatus();
        dom.renameStatuses();
    },

    loadCards: function (statusId) {
        dataHandler.getCardsByStatusId(statusId, function (cards) {
            dom.showCards(cards, statusId);
        });
    },
    showCards: function (cards, statusId) {
        let cardList = '';

        for (let card of cards) {
            cardList += `
                <div class="card" data-card-id="${card.id}">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title">${card.title}</div>
                </div>
            `;
        }

        const outerHtml = `
            <div class="board-column-content">
                ${cardList}
            </div>
        `;

        let boardColumn = document.querySelector(`[data-status-id='${statusId}']`);
        boardColumn.insertAdjacentHTML("beforeend", outerHtml);
        dom.deletePublicCard();
        dom.renameCards();
    },

    initAddBoardButton(){
        const addBoard = document.querySelector('.create-board');
            addBoard.addEventListener('click', function () {
                addBoard.classList.add('hidden')
                 const addBoardForm = `
                    <input class="new-board-name" type="text" placeholder="Type name and press Enter" />
                 `;
            addBoard.insertAdjacentHTML("afterend", addBoardForm);
            const inputField = addBoard.parentElement.querySelector('.new-board-name');
                inputField.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter'){
                        dataHandler.createNewBoard(event.target.value,  function () {
                        });
                    inputField.remove();
                    addBoard.classList.remove('hidden')
                    }
                })
            })
    },
    initAddCardButtons() {
        const addButtons = document.querySelectorAll('.board-add');
        for (let addButton of addButtons) {
            addButton.addEventListener('click', function () {
                addButton.classList.add('hidden');
                const addButtonForm = `
                    <input class="new-card-name" type="text" placeholder="Type name and press Enter" />
                `;
                addButton.insertAdjacentHTML("afterend", addButtonForm);
                const inputField = addButton.parentElement.querySelector('.new-card-name');
                inputField.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        const board = inputField.closest('.board');
                        const status = board.closest('.board-column-content');
                        dataHandler.createNewCard(event.target.value, board.dataset.id, status.dataset.statusId, function () {

                        });
                        inputField.remove();
                        addButton.classList.remove('hidden');
                    }
                });
            });
        }
    },

    deletePublicBoard() {
        const deleteBoardButtons = document.querySelectorAll('.board-remove');
        for (let deleteBoardButton of deleteBoardButtons) {
            deleteBoardButton.addEventListener('click', function () {
                const board = deleteBoardButton.closest('.board');
                dataHandler.deletePublicBoard(board.dataset.id, function (callback) {
                });
                board.classList.add('hidden');
            });
        }
    },
    deletePublicStatus() {
        const deleteStatusButtons = document.querySelectorAll('.status-remove');
        for (let deleteStatusButton of deleteStatusButtons) {
            deleteStatusButton.addEventListener('click', function () {
                const status = deleteStatusButton.closest('.board-column');
                dataHandler.deletePublicStatus(status.dataset.statusId, function (callback) {
                });
                status.classList.add('hidden');
            });
        }
    },
    deletePublicCard() {
        const deleteCardButtons = document.querySelectorAll('.card-remove');
        for (let deleteCardButton of deleteCardButtons) {
            deleteCardButton.addEventListener('click', function () {
                const card = deleteCardButton.closest('.card');
                dataHandler.deletePublicCard(card.dataset.cardId, function (callback) {
                });
                card.classList.add('hidden');
            });
        }
    },

    initRenameBoardTitle() {
        const boardTitles = document.querySelectorAll(".board-title");
        for (let title of boardTitles){
            title.addEventListener('dblclick', function (event) {
                event.preventDefault();
                title.classList.add('hidden');
                const addRenameForm = `
                    <input class="rename-board-title" type="text" placeholder="Type name and press Enter" />
                `;
                title.insertAdjacentHTML("afterend", addRenameForm);
                const inputField = title.parentElement.querySelector('.rename-board-title');
                inputField.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        const board = inputField.closest('.board');
                        dataHandler.renameBoardTitle(event.target.value, board.dataset.id, function () {

                        });
                        inputField.remove();
                        title.textContent = event.target.value;
                        title.classList.remove('hidden');
                    }
                });
            });
        }
    },
    renameStatuses() {
        const statusTitles = document.querySelectorAll(".board-column");
        for (let title of statusTitles){
            const StatusTitle = title.firstElementChild;
            StatusTitle.addEventListener('dblclick', function (event) {

                event.preventDefault();
                StatusTitle.classList.add('hidden');
                const addRenameForm = `
                    <input class="rename-status-title" type="text" placeholder="Type name and press Enter" />
                `;
                title.insertAdjacentHTML("afterend", addRenameForm);
                const inputField = title.nextElementSibling;
                inputField.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        const status = inputField.previousElementSibling;
                        dataHandler.renameStatusTitle(event.target.value, status.dataset.statusId, function () {
                        });
                        inputField.remove();
                        StatusTitle.classList.remove('hidden');
                    }
                });
            });
        }
    },
    renameCards() {
        const cardTitles = document.querySelectorAll(".card-title");
        for (let title of cardTitles){
            title.addEventListener('dblclick', function (event) {
                event.preventDefault();
                title.classList.add('hidden');
                const addRenameForm = `
                    <input class="rename-status-title" type="text" placeholder="Type name and press Enter" />
                `;
                title.insertAdjacentHTML("afterend", addRenameForm);
                const inputField = title.nextElementSibling;
                inputField.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        const card = inputField.previousElementSibling;
                        dataHandler.renameCardTitle(event.target.value, card.dataset.cardId, function () {

                        });
                        inputField.remove();
                        title.classList.remove('hidden');
                    }
                });
            });
        }
    },

    login() {
        const loginButton = document.querySelector('#login-button');
        loginButton.addEventListener('click', function () {
            let user_name = document.querySelector('#login-username').value;
            let password = document.querySelector('#login-password').value;
            dataHandler.loginUser(user_name, password, function (callback) {
            });
        });
    },
    register() {
        const registerButton = document.querySelector('#register-button');
        registerButton.addEventListener('click', function () {
            let user_name = document.querySelector('#register-username').value;
            let password = document.querySelector('#register-password').value;
            dataHandler.registerUser(user_name, password, function (callback) {
            });
        });
    },
};
