
function wrapasync(f) {
    return function (req, res,next) {
        f(req,res).catch(next());
    }
}

module.exports=wrapasync;