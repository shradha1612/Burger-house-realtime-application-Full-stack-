function auth(req,res,next){   //middlewre 3 parameters ..req,res and a callback next()
    if(req.isAuthenticated()){     //method of passport we used
        return next()
    }
    return res.redirect('/login')

}

module.exports= auth