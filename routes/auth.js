const express = require("express")
const User = require("../models/user")
const { createUserJwt, generatePasswordResetToken } = require("../utils/tokens")
const security = require("../middleware/security")
const { emailService } = require("../services")
const tokens = require("../utils/tokens")
const router = express.Router()


router.post("/login", async (req, res, next) => {
    try {
        const user = await User.login(req.body)
        const token = createUserJwt(user)
        return res.status(200).json({ user, token })
    }
    catch(err) {
        next(err)
    }
})

router.post("/register", async (req, res, next) => {
    try {
        const user = await User.register(req.body)
        const token = createUserJwt(user)
        return res.status(201).json({ user, token })
    }
    catch(err) {
        next(err)
    }
})



router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { email } = res.locals.user
        const user  = await User.fetchUserByEmail(email)
        const publicUser = User.makePublicUser(user)
        return res.status(200).json({user: publicUser})
    }
    catch(err) {
        next(err)
    }
})


router.post("/recover", async (req, res, next) => {
    try {
        const { email } = req.body
        const resetToken = tokens.generatePasswordResetToken()
        const user = await User.savePasswordResetToken(email, resetToken)

        if(user) {
            await emailService.sendPasswordResetEmail(user, resetToken.token)
        }

        return res.status(200).json({message: "If your account exists in our system, you should receive an email shortly."})
    }
    catch(err) {
        next(err)
    }
})




router.post("/password-reset", async (req, res, next) => {
    try {
        const { token } = req.query
        const { newPassword } = req.body
        const user = await User.resetPassword(token, newPassword)

        if(user) {
            await emailService.sendPasswordResetConfirmationEmail(user)
        }

        return res.status(200).json({message: `Your password has been successfully reset.`})
    }
    catch(err) {
        next(err)
    }
})







module.exports = router