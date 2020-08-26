const homeController= require('../app/http/controllers/homeController')
const authController= require('../app/http/controllers/authController')
const cartControllers = require('../app/http/controllers/customers/cartController')

function initRoutes(app) {
    
    app.get('/', homeController().index )
    app.get('/login',authController().login)
    app.get('/register',authController().register)


    app.get('/cart',cartControllers().index)
    app.post('/update-cart',cartControllers().update)
} 

module.exports =initRoutes