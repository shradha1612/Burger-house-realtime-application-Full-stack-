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
const passport = require('passport')
const Emitter = require('events')

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
//Event Emitter 
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)



//session configurations
//encryption k liye seret key and we need cookiee for encryption
app.use(session({
   secret:'process.env.COOKIE_SECRET',
   resave:false,
    store:mongoStore,
   saveUninitialized: false,
   cookie: {maxAge: 1000 * 60 *60 *24}   //session valid for 24 hour 
}))

//passport ka confuig should be after session conf
//passport config
const passportInit= require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//Global Middleware   
app.use((req, res, next)=>{
    res.locals.session = req.session   //due to this session is available on our front end
    res.locals.user = req.user
    next()

})

//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')

//always write routes agter template engine block

require('./routes/web')(app)


const server = app.listen(PORT, ()=>{
    console.log(`listening on  ${PORT}`)
})

//SOCKET
const io = require('socket.io')(server)
io.on("connection",(socket)=>{
    //join 
    // console.log(socket.id)
    socket.on('join',(orderId)=>{
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to( `order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced', (data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})