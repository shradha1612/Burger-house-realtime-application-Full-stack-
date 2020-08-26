require('dotenv').config()  //jitne bhi variables .env me hai usko access  kr sakte hai
const express = require('express')
const app = express()
const ejs= require('ejs')
const path =require('path')
const expressLayout= require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose= require('mongoose')
const session = require('express-session')
const flash= require('express-flash')
const MongoDbStore = require('connect-mongo')(session)     //call  and pass session



//Database connection
const url="mongodb+srv://dbshradha1612:4hlk84CJ0J37KTPW@cluster0.nut94.mongodb.net/Burger?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify:true});
const connection= mongoose.connection;
connection.once('open', ()=>{
    console.log('database connected');
}) .catch(err=>{
    console.log('connection failed')
})


//session store
let mongoStore = new MongoDbStore({
    mongooseConnection:connection,
    collection: 'sessions'
})


//session configurations
//encryption k liye seret key and we need cookiee for encryption
app.use(session({
   secret:'process.env.COOKIE_SECRET',
   resave:false,
    store:mongoStore,
   saveUninitialized: false,
   cookie: {maxAge: 1000 * 60 *60 *24}   //session valid for 24 hour 
}))


app.use(flash())
app.use(express.json())


//Global Middleware
app.use((req, res, next)=>{
    res.locals.session = req.session
    next()

})

//Assets
app.use(express.static('public'))


//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')

//always write routes agter template engine block

require('./routes/web')(app)


app.listen(PORT, ()=>{
    console.log(`listening on  ${PORT}`)
})