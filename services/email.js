const { config } = require("dotenv")
const nodemailer = require("nodemailer")
const nodemailerSendgrid = require("nodemailer-sendgrid")
const { resetPassword } = require("../models/user")



class EmailService {
    constructor(config) {
        // initialize
        const { isActive, apiKey, clientUrl, emailFromAddress, applicationName } = config

        const transport = nodemailer.createTransport(nodemailerSendgrid({ apiKey }))



        this.transport = transport
        this.isActive = isActive
        this.clientUrl = clientUrl
        this.emailFromAddress = emailFromAddress
        this.applicationName = applicationName
    }



    async sendEmail(email) {
        try {
            const res = await this.transport.sendMail(email)
            const status = res?.[0]?.statusCode
            if (status === 202) return { status, email, error: null}

            return { status, email, error: res?.[0]?.body }

        } catch (err) {
            console.error(`Errors with email occured: ${String(err)}`)
            
            const errors = err?.response?.body?.errors

            return { status: 400, email, error: errors || [err] }
        }
    }




    constructPasswordResetUrl(token) {
        return `${this.clientUrl}/password-reset?token=${token}`
    }



    async sendPasswordResetEmail(user, token) {
        
        const resetPasswordUrl = this.constructPasswordResetUrl(token)

        const email = {
            to: user.email,
            from: this.emailFromAddress,
            subject: `Reset your password for ${this.applicationName}`,
            html: 
            `
                <html>
                    <body>
                        <h1> Password Reset Notification </h1>
                        <br/>
                        <p> There was recently a request to change the password for your account.</p>
                        <br/>
                        <p>If you requested this change, set the new password here:</p>
                        <a href="${resetPasswordUrl}"><button>Reset your password</button></a>
                        <p>If you did not make this request, contact us immediately for account support and security.</p>
                    </body>
                </html>
            `
        }


        return await this.sendEmail(email)
    }


    async sendPasswordResetConfirmationEmail(user) {

        const email = {
            to: user.email,
            from: this.emailFromAddress,
            subject: `Your ${this.applicationName} password has been reset successfully.`,
            html: 
            `
                <html>
                    <body>
                        <h1> Password Reset Notification </h1>
                        <br/>
                        <p>This is a confirmation of a successful password reset for your account.</p>
                        <br/>

                        <p>If you did not reset your password, contact us immediately.</p>
                    </body>
                </html>
            `
        }


        return await this.sendEmail(email)
    }






}



module.exports = EmailService