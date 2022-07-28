const { BadRequestError, UnauthorizedError, NotFoundError} = require("../utils/errors")
const db = require("../db")


class Profile {

    static async listUserCoursesByUser(user) {

        //pull all user created courses from database that the currently signed in user has created
        const results = await db.query(`
            SELECT c.sport_name,
                   c.id AS "courseId",
                   c.course_title,
                   c.course_cover_image_URL,
                   c.course_short_description,
                   c.course_content,
                   c.course_tips_tricks,
                   c.difficulty,
                   c.course_tutorial_video_URL,
                   c.created_at,
                   c.user_id,
                   u.email
            FROM UserCreatedCourses AS c
                JOIN users AS u ON u.id = c.user_id
            WHERE u.email = $1
            ORDER BY c.created_at DESC
        `, [user.email])
        return results.rows
    }


    static async listFollowedTeamsByUser(user) {

        //pull all user followed teams from database that are owned by the currently signed in user 
        const results = await db.query(`
            SELECT t.team_name,
                   t.team_logo,
                   t.team_id,
                   t.team_league,
                   t.team_sport_name,
                   t.user_id,
                   t.following_at,
                   u.email
            FROM UsersFollowingTeam AS t
                JOIN users AS u ON u.id = t.user_id
            WHERE u.email = $1
            ORDER BY t.following_at DESC
        `, [user.email])
        return results.rows
    }


}



module.exports = Profile