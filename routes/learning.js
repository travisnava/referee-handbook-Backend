const express = require("express")
const router = express.Router()
const security = require("../middleware/security")
const Learning = require("../models/Learning")


//Return all beginner courses 
router.get("/", async(req, res, next) =>{
    try {
        const beginnerCourses = await Learning.listAllBeginnerCourses()
        return res.status(200).json({beginnerCourses})
    } catch (err) {
        next(err)
    }
})

//Return a beginner course for a specific sport name
router.get("/:sportname/beginner", async (req, res, next) => {
    try {
        const sportInfo = await Learning.fetchSportByName(req.params.sportname)
        return res.status(200).json({sportInfo})
    } catch (err) {
        next(err)
    }
})


//Post new user created course, return newly created course
router.post("/:sportname", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // accept request body with one course key containing an object with all attributes of a user course entry
        const { user } = res.locals
        const course = await Learning.createNewCourse({course: req.body, user})
        return res.status(201).json({ course })
    }
    catch(err) {
        next(err)
    }
})


//Update a user created course based on a specific course id
router.put("/:sportname/userCreated/:courseId", async (req, res, next) => {
    try {

        //edits user course based on the paramenters provided
        const { courseId } = req.params
        const course = await Learning.updateExistingCourse({course: req.body, courseId: courseId})
        return res.status(204).json({course})

    } catch (err) {
        next(err)
    }
})

//List all user created courses for the current sport course list
router.get("/:sportname", async (req, res, next) => {
    try {
        // send json response back for list of all user created courses under sportName category
        const { sportname } = req.params

        const userCourses = await Learning.listUserCoursesBySport(sportname)
        return res.status(200).json({ userCourses })
    }
    catch(err) {
        next(err)
    }
})



//fetches user created courses for the specified courseId
router.get("/:sportname/userCreated/:courseId", async (req, res, next) => {
    try {
        // send json response back containing all information about that specific user created course
        const { sportname, courseId } = req.params
        const { user } = res.locals
        const userCourse = await Learning.listUserCourseById({sportname, courseId, user})
        return res.status(200).json({ userCourse })
    }
    catch(err) {
        next(err)
    }
})

//users can delete a course based on a specific course id
router.delete("/:sportname/userCreated/:courseId", async (req, res, next) => {

    try {
        //deletes user course based on parameters provided
        const { courseId } = req.params

        const results = await Learning.deleteCourseById({courseId})

        return res.status(204).json({status: "success", result: results})

    } catch (err)  {
        next(err)
    }
})








module.exports = router