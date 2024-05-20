# Description
This project is part of a challenge to design optimal routes for mobile financial services provided by Caixa d'Enginyers to various municipalities in Catalonia. The goal is to ensure that the routes are efficient, meet regulatory requirements, and can adapt to real-time conditions such as traffic.

- Team: Genís Carretero Ferrete & Pau Serrat Gutiérrez

# Project Structure
Directories and Files
`mapsAPI.js`: Contains functions for interacting with the Google Maps API to process the data, get distances & more useful information.
`database/dbUtils.js`: Contains functions for retrieving data from the database.
`CE-db-migrations.sql`: SQL script for setting up and migrating the database

# Key Functions
`calcularRuta()`
This is the main function that calculates optimal routes for the mobile financial service.

# Usage Prerequisites
- Node.js
- MySQL
- Google Maps API Key

# Installation
- Clone the repository
- Install dependencies `npm i`
- Have a correctly populated '.env' file located on the main `/src` directory.

# Running the Project
Ensure the database is set up and populated. Use the `CE-db-migrations.sql` migration file.
Run the main script with `npm run start`