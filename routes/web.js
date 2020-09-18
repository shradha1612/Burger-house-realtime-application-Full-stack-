const homeController= require('../app/http/controllers/homeController')
const authController= require('../app/http/controllers/authController')
const cartControllers = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')


//Middleware
const guest = require ('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')  //it is for protected routes those who r loged in can only go
const admin = require('../app/http/middlewares/admin') 



function initRoutes(app) {
    app.get('/', homeController().index )
    app.get('/login',guest, authController().login)    //middleware as second parameter 
    app.post('/login',authController().postLogin)
    app.get('/register',guest, authController().register)
    app.post('/register',authController().postRegister)
    app.post('/logout',authController().logout)

    app.get('/cart',cartControllers().index)
    app.post('/update-cart',cartControllers().update)
    // app.post('/orders',orderController().store)
    //Customer routes
    app.post('/orders',auth,orderController().store)    
    app.get('/customer/orders',auth, orderController().index)


    //Admin routes
    app.get('/admin/orders',admin, AdminOrderController().index)

} 

module.exports =initRoutes