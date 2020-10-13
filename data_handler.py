from psycopg2 import extensions
from psycopg2.extras import RealDictCursor

import database_common


@database_common.connection_handler
def get_boards(cursor: RealDictCursor):
    cursor.execute("""
        SELECT *
        FROM boards;""")
    return cursor.fetchall()


@database_common.connection_handler
def get_statuses_for_board(cursor: RealDictCursor, board_id):
    cursor.execute("""
        SELECT *
        FROM statuses
        WHERE board_id = %(board_id)s
        ORDER BY id;""", {'board_id': board_id})
    return cursor.fetchall()


@database_common.connection_handler
def create_board(cursor: RealDictCursor, title):
    cursor.execute("""
        INSERT INTO boards(title)
        VALUES (%(title)s)
        RETURNING id; 
    """, {'title': title})
    return cursor.fetchone().get('id')

@database_common.connection_handler
def default_status(cursor: RealDictCursor, title, board_id):
    cursor.execute("""
        INSERT INTO statuses(title, board_id)
        VALUES ((%(title)s), (%(board_id)s))
        
    """, {'title': title, 'board_id': board_id})

@database_common.connection_handler
def create_card(cursor: RealDictCursor, title, id):
    cursor.execute("""
        INSERT INTO cards(title, board_id)
        VALUES (%(title)s, %(id)s)
    """, {'title': title, 'id': id})


@database_common.connection_handler
def get_cards_for_status(cursor: RealDictCursor, status_id):
    cursor.execute("""
        SELECT *
        FROM cards
        WHERE status_id = %(status_id)s
        ORDER BY "order";""", {'status_id': status_id})
    return cursor.fetchall()


@database_common.connection_handler
def rename_board_title(cursor: RealDictCursor, new_title, board_id):
    cursor.execute("""
        UPDATE boards
        SET title = %(new_title)s
        WHERE id = %(board_id)s;""", {'new_title': new_title, 'board_id': board_id})


@database_common.connection_handler
def rename_status_title(cursor: RealDictCursor, new_title, status_id):
    cursor.execute("""
        UPDATE statuses
        SET title = %(new_title)s
        WHERE id = %(status_id)s;""", {'new_title': new_title, 'status_id': status_id})
    return cursor.fetchall()


@database_common.connection_handler
def rename_card_title(cursor: RealDictCursor, new_title, card_id):
    cursor.execute("""
            UPDATE cards
            SET title = %(new_title)s
            WHERE id = %(card_id)s;""", {'new_title': new_title, 'card_id': card_id})
    return cursor.fetchall()


# creates new public boards
@database_common.connection_handler
def add_public_board(cursor: RealDictCursor, title):
    cursor.execute("""
        INSERT INTO boards
        VALUES (DEFAULT, %(title)s, DEFAULT)
        """, {'title': title})


# deletes public board
@database_common.connection_handler
def delete_public_board(cursor: RealDictCursor, board_id):
    cursor.execute("""
        DELETE FROM cards
        WHERE cards.board_id = %(board_id)s;
        DELETE FROM statuses
        WHERE statuses.board_id = %(board_id)s;
        DELETE FROM boards
        WHERE boards.id = %(board_id)s;
        """, {'board_id': board_id})


# deletes public status
@database_common.connection_handler
def delete_public_status(cursor: RealDictCursor, status_id):
    cursor.execute("""
        DELETE FROM cards
        WHERE cards.status_id = %(status_id)s;
        DELETE FROM statuses
        WHERE statuses.id = %(status_id)s;
        """, {'status_id': status_id})


# deletes public card
@database_common.connection_handler
def delete_public_card(cursor: RealDictCursor, card_id):
    cursor.execute("""
        DELETE FROM cards
        WHERE id = %(card_id)s
        """, {'card_id': card_id})


# pass an array of default status title -- 4
@database_common.connection_handler
def add_default_statuses_to_board(cursor: RealDictCursor, *title):
    cursor.execute("""
        INSERT INTO boards
        VALUES 
            (DEFAULT, %(title)s, DEFAULT),
            (DEFAULT, %(title)s, DEFAULT),
            (DEFAULT, %(title)s, DEFAULT),
            (DEFAULT, %(title)s, DEFAULT)
        """, {'title': title})


# get user data by username
@database_common.connection_handler
def get_user_by_id(cursor: RealDictCursor, user_name):
    cursor.execute("""
    SELECT *
    FROM users
    WHERE username = %(user_name)s
    """, {'user_name': user_name})
    return cursor.fetchone()


@database_common.connection_handler
def user_registration(cursor: RealDictCursor, user_name, password):
    cursor.execute("""
        INSERT INTO users
        VALUES (DEFAULT, %(user_name)s, %(password)s)
        """, {'user_name': user_name, 'password': password})
