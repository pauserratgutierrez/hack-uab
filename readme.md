# Introduction
This project is part of a challenge to design optimal routes for mobile financial services provided by Caixa d'Enginyers to various municipalities in Catalonia. The goal is to ensure that the routes are efficient, meet regulatory requirements, and can adapt to real-time conditions such as traffic.

Team: Genís Carretero Ferrete & Pau Serrat Gutiérrez

# Project Structure
Directories and Files
`mapsAPI.js`: Contains functions for interacting with the Google Maps API to process the data, get distances & more useful information.
database/dbUtils.js: Contains functions for retrieving data from the database, including starting points and municipality information.
CE-db-migrations.sql: SQL script for setting up and migrating the database.
1_Template_Challenges_-_UABTH_-_Caixa_Enginyers.docx: Document with challenge details.
Lot_2_Municipis.pdf, Lot_4_Municipis.pdf, Lot_5_Municipis.pdf: PDFs with detailed information about the municipalities in different lots.
Dades_Municipis.xlsx: Excel file with data on municipalities.
Presentacio_CE_Repte_Hack.pptx: PowerPoint presentation with project background and requirements.
Key Functions
computGlobal()
This is the main function that calculates optimal routes for the mobile financial service. It performs the following steps:

Initialization: Sets working hours, truck velocity, and other parameters.
Loading Data: Loads municipality data and starting points from the database.
Route Computation: Iteratively computes routes considering constraints like maximum municipalities per day and working hours.
Output: Converts the computed routes to a JSON format.
carregaLots()
Loads the municipalities for each lot and block from the database.

computeRoute()
Recursively computes an optimal route for a given starting point, considering distances, working hours, and municipalities to visit.

getRoutes()
Generates routes for all lots, ensuring each municipality is visited and constraints are respected.

tojson()
Converts the computed routes into a JSON structure for easy use and analysis.

Usage
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

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgements
This project was developed as part of a challenge set by Caixa d'Enginyers. The goal is to optimize mobile financial services across various municipalities in Catalonia, ensuring efficient and adaptive route planning.