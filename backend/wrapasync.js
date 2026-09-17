
function wrapasync(f) {
    return function (req, res,next) {
        f(req,res,next).catch(next);
    }
}

module.exports=wrapasync;