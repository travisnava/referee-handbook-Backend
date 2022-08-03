const db = require("../db")
const { BadRequestError } = require("../utils/errors")

class Rating {
    static async fetchRatingForCourseByUser({ user, courseId }) {
        const results = await db.query(`
            SELECT rating, user_id, course_id, created_at
            FROM ratings
            WHERE user_id = (SELECT id FROM users WHERE email = $1)
                AND course_id = $2
        `, [user.email, courseId])


        return results.rows[0]


    }



    static async createRatingForCourse({ rating, user, courseId}) {
        if (!Number(rating || Number(rating) <= 0 || Number(rating) > 5)){
            throw new BadRequestError(`Invalid rating provided. Must be an integer between 1-5`)
        }

        //check if user has already added a rating for this course
        //throw an error if yes
        const existingRating = await Rating.fetchRatingForCourseByUser({ user, courseId})
        if (existingRating) {
            throw new BadRequestError(`Users aren't allowed to leave multiple ratings for a single course.`)
        }
        //otherwise then insert rating into the db


        const results = await db.query(`
            INSERT INTO ratings (rating, user_id, course_id)
            VALUES($1, (SELECT id FROM users WHERE email = $2), $3)
            RETURNING rating, user_id, course_id, created_at;
            
        `, [rating, user.email, courseId])


        return results.rows[0]

    }



    static async updateRatingForCourse({ rating, user, courseId }) {

        //verify rating is valid
        if (!Number(rating || Number(rating) <= 0 || Number(rating) > 5)){
            throw new BadRequestError(`Invalid rating provided. Must be an integer between 1-5`)
        }

        //update rating for course by specific user
        const results = await db.query(`
            UPDATE ratings 
            SET rating = $1
            WHERE user_id = (SELECT id FROM users WHERE email = $2) AND course_id = $3
            RETURNING rating, user_id, course_id, created_at;
        `, [rating, user.email, courseId])


        return results.rows[0]


    }

}






module.exports = Rating