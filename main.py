from flask import Flask, render_template, url_for, request, redirect, session, app, flash
from util import json_response
from util import hash_password as hash_pw
from util import verify_password as verify_pw
import data_handler
import secrets


app = Flask(__name__)

app.secret_key = secrets.token_hex(12)


@app.route("/")
def index():
    username = session["username"] if "username" in session else None
    return render_template('index.html', username=username)


@app.route("/registration", methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        user_name = request.form.get("register-username")
        hashed_pw = hash_pw(request.form.get("register-password"))
        check_user = data_handler.get_user_by_id(user_name)
        if not check_user:
            data_handler.user_registration(user_name, hashed_pw)
            return redirect(url_for('login'))
        else:
            flash("This email is already registered")
            return redirect(url_for('login'))
    return render_template('registration.html')


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_name = request.form.get("login-username")
        password = request.form.get("login-password")
        found_user = data_handler.get_user_by_id(user_name)
        if found_user:
            valid_pass = verify_pw(password, found_user['password'])
            if not valid_pass:
                flash("Password or Username incorrect")
                return render_template('login.html', not_found_user=not found_user,
                                       not_valid_pass=False)

        elif not found_user or not user_name or not password:
            flash("Wrong email or password")
            return render_template('login.html', not_found_user=not found_user,
                                   not_valid_pass=False)

        session["username"] = user_name
        return redirect(url_for('index'))
    return render_template('login.html', not_found_user=False, not_valid_pass=False)  # todo invalid


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-statuses/<int:board_id>")
@json_response
def get_statuses_for_board(board_id: int):
    return data_handler.get_statuses_for_board(board_id)


@app.route("/get-cards/<int:status_id>")
@json_response
def get_cards_for_board(status_id: int):
    return data_handler.get_cards_for_status(status_id)


@app.route('/add-card', methods=['POST'])
def add_card():
    title = request.json['cardTitle']
    board_id = request.json['boardId']
    return data_handler.create_card(title, board_id)


@app.route('/add-board', methods=['POST'])
@json_response
def create_board():
    board_id = data_handler.create_board(request.json)
    def_status = ("New", "In progress", "Stuck", "Done")
    for status in def_status:
        data_handler.default_status(status, board_id)


@app.route('/rename-board-title', methods=['POST'])
def rename_board_title():
    new_title = request.json['newTitle']
    board_id = request.json['boardId']
    return data_handler.rename_board_title(new_title, board_id)


@app.route('/delete-public-board', methods=['POST'])
def delete_public_board():
    board_id = request.json['boardId']
    return data_handler.delete_public_board(board_id)


@app.route('/delete-public-status', methods=['POST'])
def delete_public_status():
    status_id = request.json['statusId']
    return data_handler.delete_public_status(status_id)


@app.route('/delete-public-card', methods=['POST'])
def delete_public_card():
    card_id = request.json['cardId']
    return data_handler.delete_public_card(card_id)


@app.route('/rename-status-title', methods=['POST'])
def rename_status_title():
    new_title = request.json['newTitle']
    status_id = request.json['statusId']
    return data_handler.rename_status_title(new_title, status_id)


@app.route('/rename-card-title', methods=['POST'])
def rename_card_title():
    new_title = request.json['newTitle']
    card_id = request.json['cardId']
    return data_handler.rename_card_title(new_title, card_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
