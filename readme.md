# Introduction
This project is part of a challenge to design optimal routes for mobile financial services provided by Caixa d'Enginyers to various municipalities in Catalonia. The goal is to ensure that the routes are efficient, meet regulatory requirements, and can adapt to real-time conditions such as traffic.

Team: Genís Carretero Ferrete & Pau Serrat Gutiérrez

# Project Structure
Directories and Files
`mapsAPI.js`: Contains functions for interacting with the Google Maps API to process the data, get distances & more useful information.
`database/dbUtils.js`: Contains functions for retrieving data from the database.
`CE-db-migrations.sql`: SQL script for setting up and migrating the database

# Key Functions
`computGlobal()`
This is the main function that calculates optimal routes for the mobile financial service. It performs the following steps:

# Usage
Prerequisites
Node.js installed
Access to the required databases
API key for the mapping service
Installation
Clone the repository
sh
Copy code
git clone <repository_url>
Navigate to the project directory
sh
Copy code
cd <project_directory>
Install dependencies
sh
Copy code
npm install
Running the Project
Ensure the database is set up and populated using the CE-db-migrations.sql script.
Run the main script
sh
Copy code
node main.js
Configuration
API Key: Ensure the mapsAPI.js file is configured with your mapping API key.
Database Connection: Ensure the database utility functions in dbUtils.js are configured with the correct connection parameters.
Data Sources
Municipality Data: Extracted from Lot_2_Municipis.pdf, Lot_4_Municipis.pdf, and Lot_5_Municipis.pdf.
Database: Setup and migration script provided in CE-db-migrations.sql.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.