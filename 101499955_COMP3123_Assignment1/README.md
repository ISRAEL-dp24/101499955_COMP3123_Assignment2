# 101499955_COMP3123_Assignment1
# Israel Osunkoya

This repository contains a backend RESTful API application for COMP 3123 – Full Stack Development, developed using Node.js, Express, and MongoDB. The project implements user and employee management endpoints with CRUD operations, following restful design principles.

## Setup Instructions

1. **Install Node.js**: (https://nodejs.org).
2. **Clone Repository**: 

git clone https://github.com/ISRAEL-dp24/101499955_COMP3123_Assignment1.git
cd 101499955_COMP3123_Assignment1

Install Dependencies:
npm install
-------------------------------------------------------------------------------
Start MongoDB: Run "mongod" in a separate terminal (ensure MongoDB is installed and listening on port 27017).
----------------------------------------------------------------------------------------------------------
Run Server in command prompt:
node server.js
--------------------------------------------------------
Server runs on http://localhost:3000.



API Endpoints:
User Management

POST /api/v1/user/signup (201): Create a new user.
POST /api/v1/user/login (200): Authenticate user and return JWT token.
--------------------------------------------------------------------------
Employee Management:

GET /api/v1/emp/employees (200): Retrieve all employees.
POST /api/v1/emp/employees (201): Create a new employee.
GET /api/v1/emp/employees/:eid (200): Retrieve employee by ID.
PUT /api/v1/emp/employees/:eid (200): Update employee.
DELETE /api/v1/emp/employees?eid=:eid (204): Delete employee.

all employee endpoints require a valid JWT token in the Authorization header (Bearer <token>).


---- Use Postman to test endpoints. Included COMP3123_API_Tests.postman_collection.json contains the test suite.
---- Ensure MongoDB is running and a user is created for token generation.

Sample User Details for Testing Login

Username: usertest
Email: usertest@example.com
Password: testpass

Create the user via /api/v1/user/signup if not present.

---Database

Database Name: comp3123_assignment1
Collections: users and employees



Notes:

JWT secret: mySuperSecretKey2025 (for reference; replace in production).
Ensure dependencies (express, mongoose, bcryptjs, jsonwebtoken) are installed.

