# ![Logo](/docs/favicon-32x32.png) mycommands-webapp-backend
> Backend of My commands web application built Typescript & Express & Mongo & AWS

<br/>

![Home page](/docs/home_page..PNG) 
<br/>
<br/>

![Modal](/docs/modal..PNG) 
## Table of contents
1. [About](#about)
2. [Installation](#installation)
3. [Structure of project](#structure-of-project)
4. [Libraries](#libraries)
5. [Updates](#updates)
6. [Licence](#license)

## About
Backend built with Express, MongoDB and EC2 of AWS.
It's need create .env.development.local and .env.production.local with your environment and variables.
<br>
To .env.development.local and .env.production.local:
<br>
```
# SERVER
PORT=3000

# DB
DATABASE=mongodb://......

# BCRYPTJS
SALT-BCRYPTJS=1

# JWT
KEY_JWT=my-key
EXPIRE_TIME_JWT=1m

# PATH SECURITY ADMIN
PATH_ADMIN=/my-path

# SO
SO=windows
```

<br>

Response's format JSEND is used in whole project, to more information see [JSEND](https://github.com/omniti-labs/jsend).

## Installation
1. Install libraries
```
    npm install
```
2. Run project with nodemond
```
    npm start
```
3. Run project in mode dev with folder /build and node
```
    npm run dev
```
4. Run project in mode prod with folder /build and node
```
    npm run prod
```
5. Run project in mode prod in Linux with ts-node
```
    npm run prod:linux
```
6. Run project in mode prod in Linux with folder /build and node
```
    npm run prod_build:linux
```
7. Build project with tsc
```
    npm run build
```
## Structure of project

    ├── build                               # code for production
    ├── api                                 # folder with all files of api. It’s also used in server side rendering with Express.js
    │   ├──  auth                           # all files about authentication
    │   │    └──  auth.ts                   # file with function validateToken with jsonwebtoken
    │   ├──  categories                     # resource of categories
    │   │    ├──  categories.controller.ts  # all functions which work with commands
    │   │    ├──  categories.model.ts       # model called 'category'
    │   │    └──  categories.router.ts      # with the endpoint searchCommands
    │   ├──  database                       # all files about data base
    │   │    └──  database.config.ts        # Mongo’s config
    │   ├──  filters                        # resource of filters
    │   │    ├──  filters.controller.ts     # filter’s controller and CRUD
    │   │    └──  filters.router.ts         # with the endpoint findFilters
    │   ├──  infoPage                       # all files about info web page such as page’s page
    │   │    ├──  infoPage.controller.ts    # with the function updateCounterPage which increment in 1
    │   │    └──  infoPage.model.ts         # model called 'info_page'
    │   ├──  manage-errors                  # all files about handle errors
    │   │    ├──  AppError.ts               # with the class AppError
    │   │    └──  handle-errors.ts          # handle all erros of the all project
    │   ├──  server                         # all files about server
    │   │    └──  server.config.ts          # server’s config: cors, endpoints, unhandledRejection, ...
    │   ├──  users                          # resource of users
    │   │    ├──  users.controller.ts       # with the function login and register
    │   │    ├──  users.model.ts            # model called 'user'
    │   │    └──  users.router.ts           # with the endpoint login and register
    │   └──  utils                          # all files about utils
    │        ├──  constants.ts              # with object of httpCodes
    │        └──  utils.ts                  # with the functions bodyIsEmpty and catchAsync
    ├── docs                                # screenshots of updatings
    ├── node_modules                        # libraries after of installing with npm install
    ├── .env.development.local              # variavles of dev
    ├── .env.production.local               # variables of prod
    ├── .gitignore                          # ignore files
    ├── ecosystem.config.js                 # PM2’s config
    ├── LICENSE                             # License MIT
    ├── model-bbdd.puml                     # model of data base, also it can be seen in a diagram
    ├── server.ts                           # file with all functions to execute the server: endpoints, handle of errors, etc
    ├── tsconfig.json                       # configuration of Typescript
    └── README.md                           # project’s info

## Libraries
**Prod**
- bcryptjs
- cors
- express
- express-mongo-sanitize
- helmet
- jsonwebtoken
- moment
- mongoose
- xss-clean

**Dev**
- @types/bcryptjs
- @types/corsç
- @types/express
- @types/jsonwebtoken
- @types/morgan
- dotenv
- morgan
- nodemon
## Updates
Each six months it tries to update all project with npm-check-updates library.
## Licence
MIT License