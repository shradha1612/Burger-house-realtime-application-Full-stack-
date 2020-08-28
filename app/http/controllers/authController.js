
const User = require('../../models/user')          //import User model
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController() {
    return {
        login(req,res){ 
        res.render('auth/login')
    
    },
    postLogin(req, res, next){
        const { email, password} = req.body; 
        //Validate request

        if( !email ||!password){
            req.flash('error','All fields are required')
           
            return res.redirect('/login')  
        }

        passport.authenticate('local',(err, user,info)=>{
            if(err){
                req.flash('error',info.message)
                return next(err)
            }
            if(!user) {
                req.flash('error',info.message)
                return res.redirect('/login') 
            }
            req.logIn(user,()=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                return res.redirect('/')
            })

        })(req,res,next)

    },
    register(req,res){
        res.render('auth/register')
    },
    async postRegister(req,res){
        const {name, email, password} = req.body;  //we will get data //object destructuring  // data we get is in req.body
        //Validate request

        if(!name || !email ||!password){
            req.flash('error','***All field are required***')
            req.flash('name',name)   //it is to display inputs even after we get error message all required
            req.flash('email',email)
            return res.redirect('/register')  //The res. redirect() function lets you redirect the user to a different URL by sending an HTTP response with status 302.
        }

        //check if email exist
        User.exists({ email:email },(err, result)=>{
            if(result){
                req.flash('error','Email already exists')
                req.flash('name',name)   //it is to display inputs even after we get error message all required
                req.flash('email',email)
            return res.redirect('/register')   //if we don not write this code //page run always round amd automatic cancle

            }
        })

        //Hash password
        const hashedPassword = await bcrypt.hash(password,10)  //**NOTE:== */ for await function must be asynchronous -NOTE** // so our function is postRegister so make it async

        //Create user 
        const user = new User({   // using model  //import kiya hai
            name,  //key value same ===name:name,
            email,
            password:hashedPassword
        })


        user.save().then((user)=>{
           // Login 
           
           return res.redirect('/')
        }).catch(err =>{
            req.flash('error','Something went wrong')   
        return res.redirect('/register')  

        })

        // console.log(req.body)
    },
    logout(req,res){
        req.logout()
    return res.redirect('/login')
    }
}
}

module.exports = authController