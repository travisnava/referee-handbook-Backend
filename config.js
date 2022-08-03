//import required packages
require("dotenv").config()
require("colors")

//extract enviornmental variables

const APPLICATION_NAME = "Referee's Handboook"


const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
const SECRET_KEY = process.env.SECRET_KEY || "secret_dev"

const IS_TESTING = process.env.NODE_ENV === "test"

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"


const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const EMAIL_SERVICE_ACTIVE = IS_TESTING ? false : process.env.EMAIL_SERVICE_STATUS === "active"
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS

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


console.log(`${APPLICATION_NAME} Config:` .red)
console.log("PORT:" .blue, PORT)
console.log("SECRET_KEY" .blue, SECRET_KEY)
console.log("IS_TESTING" .blue, IS_TESTING)
console.log("CLIENT_URL" .blue, CLIENT_URL)
console.log("EMAIL_FROM_ADDRESS" .blue, EMAIL_FROM_ADDRESS)
console.log("SENDGRID_API_KEY" .blue, SENDGRID_API_KEY)
console.log("EMAIL_SERVICE_ACTIVE" .blue, EMAIL_SERVICE_ACTIVE)
console.log("BCRYPT_WORK_FACTOR" .blue, BCRYPT_WORK_FACTOR)
console.log("Database URI:" .blue, getDatabaseUri())
console.log('----------------------------------------------------------------------------')


module.exports = {
    PORT,
    getDatabaseUri,
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
    IS_TESTING,
    SENDGRID_API_KEY,
    EMAIL_SERVICE_ACTIVE,
    EMAIL_FROM_ADDRESS,
    APPLICATION_NAME,
    CLIENT_URL
}