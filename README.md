[![Build Status](https://travis-ci.org/Hector101/e-Document-Manager.svg?branch=master)](https://travis-ci.org/Hector101/e-Document-Manager)
[![Code Climate](https://codeclimate.com/github/Hector101/e-Document-Manager/badges/gpa.svg)](https://codeclimate.com/github/Hector101/e-Document-Manager)
[![Coverage Status](https://coveralls.io/repos/github/Hector101/e-Document-Manager/badge.svg)](https://coveralls.io/github/Hector101/e-Document-Manager)

## E-Document Management System

## Description
+ Built Nodejs, Postgresql and sequelize
+ Features:
   +  Create User Account
   +  Login user account
   +  Users to create documents with permission or restriction
   +  Assign Roles to users
   +  Create access rights to documents

### Users
EndPoint                      |   Functionality
------------------------------|------------------------
POST /users/login         |   Logs in a user.
POST /users/logout        |   Logs out a user.
POST /users/              |   Creates a new user.
GET /users/               |   Gets all users (available only to the Admin).
GET /users/:id           |   Find a user by id.
PUT /users/:id           |   Updates a user's profile based on the id specified (available to the profile owner or admin)
DELETE /users/:id        |   Delete a user's profile (available only to the profile owner)
GET /users/:id/documents   | Gets all documents for a particular user
GET search/users/?q=${query} | Get all users with username containing the search query

### Documents
EndPoint                      |   Functionality
------------------------------|------------------------
POST /documents/          |   Creates a new document instance.
GET /documents/           |   Gets all documents.
GET /documents/:id       |   Find document by id.
PUT /documents/:id       |   Updates a document's attributes. (available only to the author)
DELETE /documents/:id    |   Delete a document. (available only to the author)
GET search/documents/?q=${query} | Get all documents with title containing the search query

### Roles (available only to the Super Admin)
EndPoint                      |   Functionality
------------------------------|------------------------
GET /roles/               |   Get all Roles.
POST /roles/               |   Create a Role.
PUT /roles/:id               |   Edit a Role.
DELETE /roles/:id               |   Delete a Role.

## Benefits of using this app
+ Helps users to store their personal cocuments
+ User is guaranteed of privacy and security with their documents
+ Allows users to share ideas in form of documents
+ Using this app is more cost effective than using the traditional paper document management system

## Prerequisites
```
Install nodejs version 6 and above
```

## Installation and setup
+  Navigate to a directory using your favourite `terminal`.
+  Clone this repository with the command
  +  Using HTTP;
    `$ git clone https://github.com/Hector101/headlines.git`

+  Navigate to the repo's directory
  +  `$ cd e-Document-Manager`
+  Install the app's dependencies
  +  `$ npm install`
+  Run the app
  +  `$ npm dev`
+ To uset app visit https://e-document-management.herokuapp.com/

## Running the tests
+  The tests were written using Mocha, Chai, and expect test libraries
+  The test coverage is generated by `Mocha` package
+  To run tests, navigate to the project's root directory
+  Run the following commands.
  +  `$ npm run test`
  

## How to contribute
To contribute, fork this repo to your private repository and create a pull request based on the feature you want to add.
However ensure to follow the AirBnB coding style guide.

## Disclaimer
This app and its functions are limited by time constraint and is in no way at its best.

### FAQ
+ Can I fork this repository?
  + Yes you can.
+ Can I contribute to the project?
  + Yes you can, however it is advised you follow the AirBnB style guide for your PR to be considered being merged to the project
+ Can I modify the project, for usage?
  + This project is an open source project, so you can.

## Authors
Johnson Okoro

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
