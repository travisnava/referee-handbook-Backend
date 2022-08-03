const Learning = require('../models/Learning')
const { BadRequestError, ForbiddenError } = require('../utils/errors')



//ensure authenticated user is owner of the course
//if they're not, throw an error

const authedUserOwnsCourse = async (req, res, next) => {
    try{
        const { user } = res.locals
        const { courseId } = req.params
        const course = await Learning.listUserCourseById({courseId})



        if (course.email !== user.email) {
            throw new ForbiddenError(`User is not allowed to update other users' courses.`)
        }

        // res.locals.my_course = my_course
        return next()
    }
    catch (err) {
        return next(err)
    }
}


const authedUserIsNotCourseOwner = async (req, res, next) => {
    try{
        const { user } = res.locals
        const { courseId } = req.params
        const course = await Learning.listUserCourseById({courseId})



        if (course.email === user.email) {
            throw new BadRequestError(`User are not allowed to rate their own courses.`)
        }

        // res.locals.my_course = my_course
        return next()
    }
    catch (err) {
        return next(err)
    }
}

module.exports = {
    authedUserOwnsCourse,
    authedUserIsNotCourseOwner
}