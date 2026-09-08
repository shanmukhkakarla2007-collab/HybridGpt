const jwt = require("jsonwebtoken");
function logincheck(req,res,next){
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

module.exports={logincheck}