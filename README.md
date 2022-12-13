# <p align="center">Financial Fair Play Tracker for TFF - Team 19</p>

<p align="center"><img src="https://user-images.githubusercontent.com/72891015/207389557-750f16f7-fbdb-4610-bb2e-4da0ec5f6810.png" /></p>

#### URL of the server: https://ffp-tracker.herokuapp.com/api

### Description

FFP Tracker is a web application to further transparency about the revenues and expenses of the teams that are a part of the Turkish Football Federation by making teams submit their financial documents to the system. After submissions, the federation and its lawyers will have a chance to review the files, approve or deny them based on their conclusions. With that in mind, teams will need to work harder to generate more streams of revenue to stay within their budget limits, and spend at most as much as they earn. Some actions can be taken before a serious breach of regulations as the system will be able to forecast the teams’ future situations. All information will be publicly available to all, in line with the aim to increase transparency.

### Current Working Application

You can use the current version of the application by clicking **[here](https://ffp-tracker.herokuapp.com/)**.

## User Documentation

### How to install and run the software

No need to install or run anything! As an otuside user, you can use our application to view the expense and revenue information with their graphs, as well as their individual pages, where last month information is displayed. As a user of the system, once you login, you can do everything that the system has authorized your role for.

### How to report a bug

If you came across a bug, you can create a new issue by clicking on 'Bug Report' and describing the symptoms from **[this](https://github.com/SU-CS308-22FA/CS-308-Team-19-202201/issues/new/choose)** page.

### Known bugs

## Developer Documentation

### Obtaining the source code

You can clone this GitHub repository to obtain the source code. All of the code for the application is in this repository. Once you have cloned the repository into your local machine, you should do the following:
1. Open the code editor of choice (VSCode is preffered as it has integrated terminals)
2. Run the following command in a terminal at the root of your project: `npm i`
3. Create an .env file at the root of your project. Your environment variables such as your `DB_URI`, `ACCESS_TOKEN_SECRET` will be in this file. Put your environment variables here
4. On both the client and server folders, run the following command: `npm i`
5. After installing the necessary modules, run the following commands:
    - In the server folder run: `npm run dev`
    - In the client folder run: `npm start`
6. Code as you wish!

### Directory Structure

The directory structure is as follows:
* Server → Server side of the application
  * Config → Here are the configuration files for the application
  * Controllers → Here are the controllers of the application that handle requests coming to the server
  * Middleware → Here are the middleware
  * Models → Here are the data models of the application
  * Public → Here are the public files
  * Routes → Here are the routes of the application where we route certain requests using the controllers
  * package.json → Dependencies of the application are listed here
  * Server.js → The actual server file. Everything comes together around here
* Client → Client side of the application
  * Public → Here are some of the public facing files like the index.html and the application icon
  * Src → All of the pages, routing, context files, components
    * App → Here are some configuration files for the client application
    * Components → Here are the components, we have separated components and pages so that we can manage all of them more easily
    * Contexts → Here we can manage the status of different contexts like users.
    * Pages → Here are the pages that are made of components
    * App.css → Basic css (default)
    * App.js → All the front end routes reside here
    * Index.css → Basic css (default)
    * Index.js → The parent file of the application
  * package.json → Dependencies of the client application
  * Postcss.config.js → Config files
  * Tailwind.config.js → Config Files

There are no test files.

### Deployment

#### Heroku Deployment

To deploy your application to Heroku, you can follow these steps:
1. Open an Heroku account
2. Create a new application on Heroku
3. Subscribe to the Heroku Student Developer to receive credits or pay to get credits
4. Enable GitHub Integration
5. Select GitHub deploy
6. Select automatic deploy or manually deploy to the main branch.
7. Once you are done with the development, merge your code to the main branch. This will automatically build and host the new version of your application.
8. To add the environment variables in you .env file, follow these steps:
    * The first step is to log into your account and go to the Heroku dashboard.
    * Choose the application for which you want to set the environment variables. Once you select the application, it takes you to the overview page of that project.
    * The next step is to go to the "Settings" page.
    * Once you are on the "Settings" page, scroll until you see the "Config Vars" section. To add config vars (environment variables) or modify the existing ones, click on "Reveal Config Vars".
      * If you do not have any config vars, you should see a warning message.
    * The last step is to set the config vars. In the KEY field, you specify the name of your environment variable, whereas in the VALUE field, you specify its actual value. An example would be storing the database URL as an environment variable.
    * After entering both the key and the value, press "Add" and you are done.
