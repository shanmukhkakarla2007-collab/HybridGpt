const jwt = require("jsonwebtoken");
const { signupSchema,loginSchema,chatSchema } = require("./joi");


function logincheck(req, res, next) {
    const tokenvalue = req.cookies.token;
    if (!tokenvalue) {
        return res.status(401).json("please login first");
    }
    try {
        const decoded = jwt.verify(
            tokenvalue,
            process.env.JWT_SECRET
        );
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json("invalid or expired token");
    }
}
function signupvalidation(req, res, next) {
    const { error } = signupSchema.validate(req.body);

    if (error) {
        return res.status(400).json(error.details[0].message);
    }
    next();
}
function loginvalidation(req, res, next) {
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json(error.details[0].message);
    }
    next();
}
function chatvalidation(req, res, next) {
     const { error } = chatSchema.validate(req.body);

    if (error) {
        return res.status(400).json(error.details[0].message);
    }
    next();
}
module.exports = { logincheck, signupvalidation, loginvalidation, chatvalidation }