
# Storefront Back-End

  

## Project 2 - Udacity Full Stack Javascript Developer Program

This project requires **Node.js** and **Docker**.

## Setup

First, download the repository:

`git clone https://github.com/evolaric/p2-storefront-backend.git`

Next, run NPM install to install core dependencies:

`npm install`

In the base directory of the project, create an file named `.env` and insert the data found in the `REQUIREMENTS.md` file:

*Note: I am aware that sharing this file like this is bad practice, but the requirements for the project say to include the .env file details in the project.*

Once the `.env` file is set up and dependencies installed, it is time to run Docker and set up the database container. You may do so in one of three ways:

1. If you have the Docker plugin for VSCode, you can right click on the `docker-compose.yml` file and choose "compose up" from the context menu.

2. You can run the command `npm run setup` in the base directory of this project.

3. You can run the command `docker-compose -f "docker-compose.yml" up -d --build` in the base directory of this project.

Docker will set up Postgres in a container and configure the database for the settings in the .env file. This make take a few seconds, and the new database will accept connections on the default port of 5432 on localhost.

Once Postgres is set up, you will need to run the database migrations to create the tables needed for the app to function. Run `db-migrate up` on the node command line to execute all database migrations on the development database.

## Scripts

`npm run test` - runs the tests on the dev database. Note: You may need to change the string slightly depending on you system, specifically the `ENV=test command`.  It is currently set for windows.

`npm run setup` - runs the docker command to compose the database container

`npm run clearTestDB` - clears all the data in the `test` database.

`npm run clearDevDB` - clears all data in the `dev` database.

`npm run lint` - lints all the source files.

`npm run build` - lints the files and transpiles the code to the `/dist` directory.

`npm start` - executes the above build command and starts the app on `localhost:3000`.

All other information regarding project requirements can be found in the REQUIREMENTS.md file in the base project directory.
