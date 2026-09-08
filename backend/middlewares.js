const jwt = require("jsonwebtoken");
const { signupSchema,loginSchema,chatSchema } = require("./joi");
const expresserror=require("./expresserror");

function logincheck(req, res, next) {
    const tokenvalue = req.cookies.token;
    if (!tokenvalue) {
        return next(new expresserror("please login first",401))
    }
    try {
        const decoded = jwt.verify(
            tokenvalue,
            process.env.JWT_SECRET
        );
        req.user = decoded;
        next();
    } catch (error) {
        return next(new expresserror("invalid or expired token",401));
    }
}
function signupvalidation(req, res, next) {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return next(new expresserror(error.details[0].message,400));
    }
    next();
}
function loginvalidation(req, res, next) {
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return next(new expresserror(error.details[0].message,400));
    }
    next();
}
function chatvalidation(req, res, next) {
     const { error } = chatSchema.validate(req.body);

    if (error) {
        return next(new expresserror(error.details[0].message,400));
    }
    next();
}
module.exports = { logincheck, signupvalidation, loginvalidation, chatvalidation }