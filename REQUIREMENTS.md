## .env file

```
ENV=dev

POSTGRES_HOST=127.0.0.1
POSTGRES_DB='postgres'
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='DZFC7fa853IXSfeZ'

POSTGRES_HOST_DEV=127.0.0.1
POSTGRES_DB_DEV='storefront_dev'
POSTGRES_USER_DEV='user_dev'
POSTGRES_PASSWORD_DEV='YHyxUFZUjzq8giof'

POSTGRES_HOST_TEST=127.0.0.1
POSTGRES_DB_TEST='storefront_test'
POSTGRES_USER_TEST='user_test'
POSTGRES_PASSWORD_TEST='IMBo093rE3Yl9rAA'

BCRYPT_PASSWORD=the-lizard-people-do-not-approve
SALT_ROUNDS=10
TOKEN_SECRET=1f2aea459af6b3058568cb64b6735499
```

## Database Schema

The raw database structure is as follows (generated from .env data by Docker upon compose-up):

```sql

CREATE USER ${POSTGRES_USER_DEV} WITH PASSWORD '${POSTGRES_PASSWORD_DEV}';
CREATE DATABASE ${POSTGRES_DB_DEV};
GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB_DEV} TO ${POSTGRES_USER_DEV};
CREATE USER ${POSTGRES_USER_TEST} WITH PASSWORD '${POSTGRES_PASSWORD_TEST}';
CREATE DATABASE ${POSTGRES_DB_TEST};
GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB_TEST} TO ${POSTGRES_USER_TEST};
```

## Migrations

The database migrations will create five tables:

**Users (users)**

```sql

CREATE TABLE IF NOT EXISTS users (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_name VARCHAR(100) UNIQUE NOT NULL CONSTRAINT min_length_user_name check (length(user_name) >= 6),
first_name VARCHAR(100) NOT NULL CONSTRAINT min_length_first_name check (length(first_name) >= 1),
last_name VARCHAR(100) NOT NULL CONSTRAINT min_length_last_name check (length(last_name) >= 1),
admin BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
password_digest TEXT NOT NULL
);
```

**Products (products)**

```sql

CREATE TABLE IF NOT EXISTS products (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
product_name VARCHAR(100) UNIQUE NOT NULL CONSTRAINT min_length_product_name check (length(product_name) >= 3),
price NUMERIC(12, 2) NOT NULL,
info TEXT,
category INT DEFAULT 1 NOT NULL,
FOREIGN KEY (category) REFERENCES categories(id)
);
```

**Categories (categories)**

```sql

CREATE TABLE IF NOT EXISTS categories (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
category VARCHAR(100) UNIQUE NOT NULL
);
```

**Orders (orders)**

```sql

CREATE TABLE IF NOT EXISTS orders (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id),
status BOOLEAN NOT NULL DEFAULT false,
created_at BIGINT,
closed_at BIGINT
);
```

**Order Details (order_details)**

```sql

CREATE TABLE IF NOT EXISTS order_details (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
order_id INT NOT NULL,
FOREIGN KEY (order_id) REFERENCES orders(id),
product_id INT NOT NULL,
FOREIGN KEY (product_id) REFERENCES products(id),
quantity INT NOT NULL

);
```

**Seed Data**

For ease of use, you may wish to seed the dev database with some values before testing the endpoints

```sql

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
```

## User endpoints

**User Creation** <= **REQUIRED**

`POST http://localhost:3000/users`

In the body of the request, send new user details as a raw JSON payload in the following shape:

```
{
"user_name": "username",
"first_name": "Bob",
"last_name": "Bobson",
"password": "verysecretpassword"
}
```

This will return a JWT to the user in the HTML response. Copy the text and add it to the `Bearer Token` field in Postman's authorization tab. This will unlock all the routes in the API.

**User Authentication**

You can get a new JWT at any time via

`POST http://localhost:3000/users/login`

In the body of the request, send your user name and password as a raw JSON payload in the following shape:

```
{
"user_name": "username",
"password": "verysecretpassword"
}
```

**User Record** <= **REQUIRED**

With your user token in place, you can see your user details by accessing

`GET http://localhost:3000/users/show`

Your user id will but read from your token and your information will be displayed.

**User Index** <= **REQUIRED**

With your user token in place, you can see a list of users by accessing

`GET http://localhost:3000/users/index`

## Product Endpoints

**Product Index** <= **REQUIRED**

Any user can access a list of products by accessing

`GET http://localhost:3000/products`

**Item Detail** <= **REQUIRED**

Any user can display the information on a single item by accessing

`GET http://localhost:3000/products/:id`

where `:id` can be any existing product_id

**Create Product** <= **REQUIRED**

Any authorized user can create a product by accessing

`POST http://localhost:3000/products/` and sending a raw JSON payload in the following shape:

```

{
"product_name": "Awesome New Product",
"price": 758.99,
"info": "Some descriptive text", (optional)
"category": 1 (optional, default 1)
}

```

\*\*

## Order Endpoints

All order related actions **require a token**.

**Get Current Order** <= **REQUIRED**

Any authorized user may get their current order by accessing:

`GET http://localhost:3000/orders`

If you have an existing open order, this endpoint will return it as a full Order object. If you do not have an existing order, this will create a new order and return it to you.

**Modify Current Order**

Any authorized user may modify or close their current order by accessing:

`PUT http://localhost:3000/orders`

and sending a raw JSON payload in the following shape:

```

{

"id": 14,

"details": [{"product_id": 3, "quantity": 22}, {"product_id": 4, "quantity": 22}, {"product_id": 5, "quantity": 22}],

"status": true // setting to true closes the order.

}

```

The `details` field is an array of objects in the following shape:

`[{"product_id": 3, "quantity": 22}] `

Product id is a foreign key that references the products table, and trying to insert a product ID that does not exist will return an error message.

Regardless of how the order is changed (or unchanged), this endpoint will always return a full Order object like this:

```

{
"id": 14,
"user_id": 25,
"details": [
{
"id": 65,
"order_id": 14,
"product_id": 3,
"quantity": 22
},

{
"id": 66,
"order_id": 14,
"product_id": 4,
"quantity": 22
},

{
"id": 67,
"order_id": 14,
"product_id": 5,
"quantity": 22
}
],
"status": true,
"created_at": 1631029195671,
"closed_at": 1631041919680
}
```

That should cover the basic requirements listed in the rubric.

Thanks you for taking the time to review my project, and I look forward to your feedback.
