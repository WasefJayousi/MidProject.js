const mysql = require("mysql2/promise")
require("dotenv").config();
let connection
const connect = {
    ConnectionToMySql: async () => {
        try {
            console.log("Trying to connect to mysql!")
            connection = mysql.createPool(process.env.DatabaseURI) // Connection pools help reduce the time spent connecting to the MySQL server by reusing a previous connection, leaving them open instead of closing when you are done with them.
            console.log("connected!")
            
        } catch (error) {
           console.error("Failed to connect to MySQL:", error.message);
           throw error;
        }
    },
    GetConnection: ()=> {
        return connection  
    } 
}

module.exports = connect