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
    orders (user_id, created_at)
VALUES
    (1, 1111111),
    (2, 1111111),
    (3, 1111111);

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