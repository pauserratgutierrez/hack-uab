# HACKATHON 2024: UAB THE HACK 🏆

## Description
[UAB Website](https://www.uab.cat/web/detall-de-noticia/uab-the-hack-on-es-resolen-reptes-reals-d-empreses-1345737380866.html?noticiaid=1345915849483).<br>This project is part of a challenge to design optimal routes for mobile financial services provided by Caixa d'Enginyers to various municipalities in Catalonia. The goal is to ensure that the routes are efficient, meet regulatory requirements, and can adapt to real-time conditions such as traffic.
- **Start**: Saturday 18/06/2024 at 11:00h
- **End**: Sunday 19/06/2024 at 11:45h
- **Team Members**: Genís Carretero Ferrete & Pau Serrat Gutiérrez

## Project Structure
- `app.js`: Main entry point.
- `src/`: Main folder containing the node.js logic code.
- `src/lib/maps/mapsAPI.js`: Contains functions for interacting with the Google Maps API to process the data, get distances & more useful information.
- `src/lib/database/dbUtils.js`: Contains functions for retrieving data from the database.
- `src/lib/routes`: Contains additional files for the main Back Tracking algorithm and more.
- `CE-db-migrations.sql`: SQL script for setting up and migrating the database.

## Usage Prerequisites
- Node.js
- MySQL
- Google Maps API Key (distancematrix & geocode enabled)

## Installation
- Clone the repository
- Install dependencies `npm i`
- Have a correctly populated '.env' file located on the main `/src` directory.
GOOGLE_MAPS_API_KEY=paste-here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=caixa_enginyers
DB_PORT=3306
- Ensure the MySQL database populated and running. Using the `CE-db-migrations.sql` migration file to initialise & populate it.

## Running the Project
- Run the main script with `npm run start`