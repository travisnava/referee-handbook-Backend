//import required packages
require("dotenv").config()
require("colors")

//extract enviornmental variables
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
const SECRET_KEY = process.env.SECRET_KEY || "secret_dev"

function getDatabaseUri() {
    //define variables for database connection url
    const dbUser = process.env.DATABASE_USER || "postgres"
    const dbPass = process.env.DATABASE_PASS ? encodeURI(process.env.DATABASE_PASS) : "postgres"
    const dbHost = process.env.DATABASE_HOST || "localhost"
    const dbPort = process.env.DATABASE_PORT || 5432
    const dbName = process.env.DATABASE_NAME || "refereehandbook" //TODO: Change later if necessary

    //if we already have a database uri environmental variable, use that one
    //else we create it outselves
    return process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
}

//set our password hashing parameter 
const BCRYPT_WORK_FACTOR = 13


console.log("Referee's handbook config:" .red)
console.log("PORT:" .blue, PORT)
console.log("SECRET_KEY" .blue, SECRET_KEY)
console.log("Database URI:" .blue, getDatabaseUri())
console.log('----------------------------------------------------------------------------')


module.exports = {
    PORT,
    getDatabaseUri,
    SECRET_KEY,
    BCRYPT_WORK_FACTOR
}