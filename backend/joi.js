const Joi = require("joi");

const signupSchema = Joi.object(
    {
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),

        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .min(6)
            .required()
    }
)

const loginSchema = Joi.object(
    {
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),

        password: Joi.string()
            .min(6)
            .required()
    }
)

const chatSchema = Joi.object(
    {
        message: Joi.string()
            .min(1)
            .required(),
         threadid: Joi.string()
            .guid({ version: "uuidv4" })
            .required() 
    }
)

module.exports={signupSchema,loginSchema,chatSchema};
