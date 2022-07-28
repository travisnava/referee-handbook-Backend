const bcrypt = require("bcrypt")
const db = require("../db")
const { BCRYPT_WORK_FACTOR } = require("../config")

const { UnauthorizedError, BadRequestError } = require("../utils/errors")

class User {


    static makePublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            location: user.location,
            profileImageUrl: user.profile_image_url,
            createdAt: user.created_at
        }
    }


    static async login(credentials) {
        //user submit their email and pass, if any fields missing then throw an error
        const requiredFields = ["email", "password"]
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
             throw new BadRequestError(`Missing ${field} field.`)
            }
        })

        //look up the user in db by email
        const user = await User.fetchUserByEmail(credentials.email)
        //if user is found, compare submitted passwords with pass in db
        //if match, then return the user
        if (user){
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if (isValid){
                return User.makePublicUser(user)
            }
        }
    
        //if anything goes wrong, throw an error
        throw new UnauthorizedError("Invalid email/password combination")
    }


    static async register(credentials) {

        //user submits their info
        //any field is missing then throw err
        const requiredFields = ["email", "username", "location", "firstName", "lastName",  "password", "confirmPassword"]
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} field.`)
            }
        })

        if (credentials.email.indexOf("@") <= 0){
            throw new BadRequestError("Invalid email.")
        }

        //checking for any fields exceeding character limits set in database
        requiredFields.forEach(field => {
            if(credentials[field].length > 250) {
                throw new BadRequestError(`${field} exceeds maximum character length.`)
            }
        })
        //make sure no duplicates exist with same email in db
        //throw err if yes
        const existingUserEmail = await User.fetchUserByEmail(credentials.email)
        if (existingUserEmail) {
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        //make sure no duplicates exist with same username in db
        //throw err if yes
        const existingUserUsername = await User.fetchUserByUsername(credentials.username)
        if (existingUserUsername) {
            throw new BadRequestError(`Duplicate username: ${credentials.username}`)
        }  

        const lowercasedEmail = credentials.email.toLowerCase()
        //take users pass, hash it
        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)
        //take users email, lowercase it

        //create a new user in the db with all the info
        //return the user
        const result = await db.query(`
        INSERT INTO users(
            email,
            username,
            password,
            first_name,
            last_name,
            location,
            profile_image_URL
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, email, username, password, first_name, last_name, location, profile_image_URL, created_at;
    
    `, [lowercasedEmail, credentials.username, hashedPassword, credentials.firstName, credentials.lastName,  credentials.location, credentials.profileImageURL])

    const user = result.rows[0]
    return User.makePublicUser(user)

    }







    static async fetchUserByEmail(email){
        if (!email){
            throw new BadRequestError("No email provided")
        }
        const query = `SELECT * FROM users WHERE email = $1`
        const result = await db.query(query, [email.toLowerCase()])
        const user = result.rows[0]
        return user
    }

    static async fetchUserByUsername(username){
        if (!username){
            throw new BadRequestError("No username provided")
        }
        const query = `SELECT * FROM users WHERE username = $1`
        const result = await db.query(query, [username.toLowerCase()])
        const user = result.rows[0]
        return user
    }

}



module.exports = User