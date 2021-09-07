INSERT INTO
    categories (category)
VALUES
    ('General Products'),
    (' Category 1 '),
    (' Category 2 '),
    (' Category 3 '),
    (' Category 4 '),
    (' Category 5 ');

INSERT INTO
    users (
        user_name,
        first_name,
        last_name,
        password_digest
    )
VALUES
    (
        'testuser1',
        'test',
        'user',
        'unimportantforthis'
    ),
    (
        'testuser2',
        'test',
        'user2',
        'unimportantforthis'
    ),
    (
        'testuser3',
        'test',
        'user3',
        'unimportantforthis'
    ),
    (
        'testuser4',
        'test',
        'user4',
        'unimportantforthis'
    );

INSERT INTO
    Products (product_name, price, info, category)
VALUES
    ('Item 1', 28.99, 'Some descriptive text', 1),
    ('Item 2', 38.99, 'Some descriptive text', 1),
    ('Item 3', 48.99, 'Some descriptive text', 1),
    ('Item 4', 58.99, 'Some descriptive text', 1),
    ('Item 5', 68.99, 'Some descriptive text', 2),
    ('Item 6', 18.99, 'Some descriptive text', 2),
    ('Item 7', 8.99, 'Some descriptive text', 2),
    ('Item 8', 8.99, 'Some descriptive text', 5),
    ('Item 9', 128.99, 'Some descriptive text', 2),
    ('Item 10', 2228.99, 'Some descriptive text', 3),
    ('Item 11', 128.99, 'Some descriptive text', 5),
    ('Item 12', 228.99, 'Some descriptive text', 5),
    ('Item 13', 168.99, 'Some descriptive text', 3),
    ('Item 14', 78.99, 'Some descriptive text', 3),
    ('Item 15', 44.99, 'Some descriptive text', 3),
    ('Item 16', 78.99, 'Some descriptive text', 3),
    ('Item 17', 98.99, 'Some descriptive text', 3),
    ('Item 18', 44.99, 'Some descriptive text', 4),
    ('Item 19', 99.99, 'Some descriptive text', 4),
    ('Item 20', 11.99, 'Some descriptive text', 4),
    ('Item 21',.99, 'Some descriptive text', 1);

INSERT INTO
    orders (user_id, status, created_at)
VALUES
    (1, true, 1111111),
    (1, true, 1111112),
    (1, true, 1111113),
    (1, true, 1111114),
    (1, false, 1111115),
    (2, true, 1111114),
    (2, true, 1111117),
    (2, true, 1111101),
    (2, true, 1111011),
    (2, false, 1111011);

INSERT INTO
    order_details (order_id, product_id, quantity)
VALUES
    (1, 1, 6),
    (1, 2, 6),
    (2, 3, 6),
    (2, 4, 6),
    (3, 5, 6),
    (3, 6, 6),
    (4, 7, 6),
    (4, 8, 6),
    (5, 9, 6),
    (5, 10, 6),
    (6, 11, 6),
    (6, 12, 6),
    (7, 13, 6),
    (7, 14, 6),
    (8, 15, 6),
    (8, 16, 6),
    (9, 17, 6),
    (9, 18, 6),
    (10, 19, 6),
    (10, 20, 6);