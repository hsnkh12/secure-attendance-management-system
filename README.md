# emu/university attendance management system

Welcome to the Attendance Management System (AMS) for emu/university. This application is built with Node.js and Express.js and is designed to help emu/university staff manage student attendance records.


## Features
- Record attendance for students in classes
- View attendance history for individual students or entire classes
- Secure storage of attendance data using DES encryption


## Getting Started
To get started with the AMS, follow these steps:
1. Install Node.js on your machine if it is not already installed. You can
download the latest version of Node.js from the official website.

2. Clone the AMS repository to your local machine:
```
git clone https://github.com/hsnkh12/emu-attendance-management-system.git

```
3. Navigate to the project directory and install the required dependencies:
```
cd emu-attendance-management-system
npm install

```
4. Start the application by running the following command:
```
nodemon app.js
```
5. if you faced any issues run this command in your terminal before running the app
```
export NODE_OPTIONS=--openssl-legacy-provider
```

The AMS should now be running on your local machine. You can access it by visiting http://localhost:3000 in your web browser.

## Security
One of the key features of the AMS is the use of DES encryption to secure the attendance data stored in the database. When attendance records are added or retrieved from the database, they are automatically encrypted or decrypted using the DES algorithm. This ensures that the attendance data is protected against unauthorized access.
