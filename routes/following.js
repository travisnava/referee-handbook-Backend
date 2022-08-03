const express = require("express")
const router = express.Router()
const security = require("../middleware/security")
const following = require("../models/following")



//Post new user following entry, return newly created following entry
router.post("/:sportname/:teamId", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // accept request body with one team key containing an object with all attributes of a team entry, along witih information from useParams in frontend
        const { sportname, teamId } = req.params
        const { user } = res.locals
        const team = await following.followTeam({team: req.body, user, sportname, teamId})
        return res.status(201).json({ team })
    }
    catch(err) {
        next(err)
    }
})

//Pull from database to see if user is currently following the team specified by team id and sport
router.get("/:sportname/:teamId", async (req, res, next) => {
    try {
        // send json response back to see if user is currently following the team specified by team id and sport, if not then send back empty json
        const { sportname, teamId } = req.params
        const { user } = res.locals
        const userFollowedTeams = await following.listFollowedTeamByUser({user, sportname, teamId})
        return res.status(200).json({ followedTeam: userFollowedTeams })
    }
    catch(err) {
        next(err)
    }
})



//Delete user following entry specified by sportName, current signed in user, and teamId
router.delete("/:sportname/:teamId", async (req, res, next) => {
    try {
        // send json response back of deleted entry
        const { sportname, teamId } = req.params
        const { user } = res.locals
        await following.unfollowTeam({user, sportname, teamId})
        return res.status(200).json({deletionEntry: "Entry successfully deleted"})
    }
    catch(err) {
        next(err)
    }
})







module.exports = router