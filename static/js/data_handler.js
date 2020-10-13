// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    init: function () {
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },

    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
    },

    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getStatusesByBoardId: function (boardId, callback) {
        this._api_get(`/get-statuses/${boardId}`, (response) => {
            this._data['statuses'] = response;
            callback(response);
        })
    },
    getCardsByStatusId: function (statusId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${statusId}`, (response) => {
            this._data['cards'] = response;
            callback(response);
        })
    },

    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        dataHandler._api_post('/add-board', boardTitle, callback);

    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        dataHandler._api_post(
            '/add-card',
            {
                cardTitle: cardTitle,
                boardId: boardId,
                statusId: statusId
            },
            callback
        );
    },

    renameBoardTitle: function (newTitle, boardId, callback) {
        dataHandler._api_post(
            '/rename-board-title',
            {
                newTitle: newTitle,
                boardId: boardId
            },
            callback
        )
    },
    renameStatusTitle: function (newTitle, statusId, callback) {
        dataHandler._api_post(
            '/rename-status-title',
            {
                newTitle: newTitle,
                statusId: statusId
            },
            callback
        )
    },
    renameCardTitle: function (newTitle, cardId, callback) {
        dataHandler._api_post(
            '/rename-card-title',
            {
                newTitle: newTitle,
                cardId: cardId
            },
            callback
        )
    },

    deletePublicBoard: function (boardId, callback) {
        dataHandler._api_post(
            '/delete-public-board',
            {
                boardId: boardId
            },
            callback
        )
    },
    deletePublicStatus: function (statusId, callback) {
        dataHandler._api_post(
            '/delete-public-status',
            {
                statusId: statusId
            },
            callback
        )
    },
    deletePublicCard: function (cardId, callback) {
        dataHandler._api_post(
            '/delete-public-card',
            {
                cardId: cardId
            },
            callback
        )
    },

    registerUser: function (user_name, password, callback) {
        dataHandler._api_post(
            '/registration',
            {
                user_name: user_name,
                password: password
            },
            callback
        )
    },
    loginUser: function (user_name, password, callback) {
        dataHandler._api_post(
            '/login',
            {
                user_name: user_name,
                password: password
            },
            callback
        )
    }
};
