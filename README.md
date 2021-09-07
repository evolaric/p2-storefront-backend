# Storefront Back-End

## Project 2 - Udacity Full Stack Javascript Developer Program

**Requirements**

This project requires Node.js and Docker.

Setup
First, download the repository:

    git clone https://github.com/evolaric/p2-storefront-backend.git

Next, run NPM install to install core dependencies:

    npm i 

In the base directory of the project, create an file named .env and insert this data:

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
    
Note: I am aware that sharing this file like this is bad practice, but the requirements for the project say to include the .env file details in the README.

Once the .env file is set up, it is time to run Docker and set up the database container.  You may do so in one of three ways:
1. If you have the Docker plugin for VSCode, you can right click on the `docker-compose.yml` file and choose "compose up" from the context menu.
2. You can run the command `npm run setup` in the base directory of this project.
3. You can run the command `docker-compose -f "docker-compose.yml" up -d --build` in the base directory of this project.

Docker will set up Postgres in a container and configure the database for the settings in the .env file.  This make take a few seconds, and the new database will accept connections on the default port of 5432 on localhost.

Once Postgres is set up, you will need to run the database migrations to create the tables needed for the app to function.  Run `db-migrate up` on the node command line to execute all database migrations on the development database.

You will also need to seed some basic information into the dev database in order to insure you can use all the endpoints successfully.  This SQL query will ensure there are no foreign key related errors when attempting to use the api endpoints
```
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
This query can also be found in the src/tests folder: [sql-product-seed.sql](https://github.com/evolaric/p2-storefront-backend/blob/main/src/tests/sql-product-seed.sql)

This data is NOT needed for the testing database, so do not add it there.  Data is seeded throughout the testing process, and cleared after each testing run.

Running the tests
Once the database is set up, you can run the unit and endpoint tests by running `npm run clearTestDB` to ensure the testing database is clean, and then run`npm run test` in the project directory.  Hopefully, you will see a lot of green!

Testing the endpoints in Postman
Start up the api by running `npm start`.  This will invoke eslint, the Typescript compiler, and then start the app on `localhost:3000`

The first thing you will probably want to do it create a user account and get a JWT.

## User endpoints

**User Creation**
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
This will return a JWT to the user.  Copy the text and add it to the `Bearer Token` field in Postman's authorization tab.  This will unlock all the routes in the API.

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
**User Record**
With your user token in place, you can see your user details by accessing
`GET http://localhost:3000/users/show`
Your user id will but read from your token and your information will be displayed.

**User Index**
With your user token in place, you can see a list of users by accessing
`GET http://localhost:3000/users/index`

## Product Endpoints

**Product Index**
Any user can access a list of products by accessing
`GET http://localhost:3000/products`

**Item Detail**
Any user can display the information on a single item by accessing
`GET http://localhost:3000/products/:id`
where `:id` can be any existing product_id

**Create Product**
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

**

## Order Endpoints

All order related actions **require a token**.

**Get Current Order**
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
"status": true    // setting to true closes the order.
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



 






















