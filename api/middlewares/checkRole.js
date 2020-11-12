

// check role middleware
module.exports = roles => (req,res,next) => {
    
    if(roles.includes(req.user.role)){
        next();
    }else{
        const error =  new Error("Unauthorized. You don't have access to this resource.");
        error.status = 403;
        next(error);
    }
}