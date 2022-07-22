const { BadRequestError, UnauthorizedError, NotFoundError} = require("../utils/errors")
const db = require("../db")

class Learning {
    static async listAllBeginnerCourses() {

        //pull all beginner courses from the database and return the results as rows
        const result = await db.query(` SELECT * FROM BeginnerCourses`)

        const courses = result.rows

        return courses
    }

    //query database by sports name
    static async fetchSportByName(name) {

        //if no name is provided, return an error
        if(!name) {
            throw new BadRequestError("No name is provided")
        }
        
        const query = `
            SELECT * FROM BeginnerCourses
            WHERE BeginnerCourses.sport_name = $1
        `
        const result = await db.query(query, [name])

        //error handling in case sports name is not in the beginner courses database
        if (!result) {
            throw new NotFoundError("Unable to find name: ", name)
        }

        const sports = result.rows

        return sports;

    }


    static async createNewCourse({course, user}) {


        //error checking to see if form is missing any required parameters
        const requiredFields = ["sportName", "courseName", "shortDescription", "detailedDescription", "tutorialVideoURL", "coverImageURL", "difficulty", "tipsAndTricks"]
        requiredFields.forEach(field => {
            if (!course.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} field.`)
            }
        })

        //inserting course entry into db
        const results = await db.query(`
            INSERT INTO UserCreatedCourses (
                sport_name,
                course_title,
                course_short_description,
                course_content,
                course_cover_image_URL,
                course_tutorial_video_URL,
                course_tips_tricks,
                difficulty,
                user_id
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM users WHERE email = $9))
                RETURNING id,
                          sport_name
                          course_title,
                          course_short_description,
                          course_content,
                          course_cover_image_URL,
                          course_tutorial_video_URL,
                          course_tips_tricks,
                          difficulty,
                          user_id,
                          created_at

        
        `, [course.sportName, course.courseName, course.shortDescription, course.detailedDescription, course.coverImageURL, course.tutorialVideoURL, course.tipsAndTricks, course.difficulty, user.email])

        return results.rows[0]
    }



    static async listUserCoursesBySport({sportname, user}) {

        //pull all user created courses from database that satisfy the sportName parameter
        const results = await db.query(`
            SELECT c.course_title,
                c.course_short_description,
                c.course_content,
                c.course_cover_image_URL,
                c.course_tutorial_video_URL,
                c.course_tips_tricks,
                c.difficulty,
                c.created_at,
                u.username
            FROM UserCreatedCourses AS c
                JOIN users AS u ON u.id = c.user_id
            WHERE c.sport_name = $1 AND u.email = $2
            ORDER BY c.created_at DESC
        `, [sportname, user.email])

        return results.rows
   

    }

















}

module.exports = Learning