const { BadRequestError, UnauthorizedError, NotFoundError} = require("../utils/errors")
const db = require("../db")

class following {




    static async followTeam({team, user, sportname, teamId}) {


        //error checking to see if form is missing any required parameters
        const requiredFields = ["teamName", "teamLogo", "teamLeague"]
        requiredFields.forEach(field => {
            if (!team.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} field.`)
            }
        })

        //inserting new following entrry into db
        const results = await db.query(`
            INSERT INTO UsersFollowingTeam (
                team_name,
                team_logo,
                team_id,
                team_league,
                team_sport_name,
                user_id
                )
                VALUES ($1, $2, $3, $4, $5,(SELECT id FROM users WHERE email = $6))
                RETURNING id,
                          team_name
                          team_logo,
                          team_id,
                          team_league,
                          team_sport_name,
                          user_id,
                          following_at

        
        `, [team.teamName, team.teamLogo, teamId, team.teamLeague, sportname, user.email])

        return results.rows[0]
    }


    static async listFollowedTeamByUser({user, sportname, teamId}) {

        //pull all user followed teams from database that are owned by the currently signed in user 
        const results = await db.query(`
            SELECT t.team_name,
                   t.team_id,
                   t.team_sport_name,
                   u.email
            FROM UsersFollowingTeam AS t
                JOIN users AS u ON u.id = t.user_id
            WHERE u.email = $1 AND t.team_sport_name = $2 AND t.team_id = $3
        `, [user.email, sportname, teamId])
        return results.rows[0]
    }


    static async unfollowTeam({user, sportname, teamId}) {

        //delete entry where user is following team specified by teamId & sportName in function parameters
        const results = await db.query(`
            DELETE FROM UsersFollowingTeam AS t
            USING users AS u
            WHERE t.team_sport_name = $1 AND t.team_id = $2 AND u.id = t.user_id AND u.email = $3
            RETURNING *;
        `, [sportname, teamId, user.email,])
        return results.rows[0]

    }









}

module.exports = following