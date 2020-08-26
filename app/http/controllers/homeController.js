const Menu = require('../../models/menu')


function homeController() {
    return {
       async index(req,res){ 

            const burgers=await Menu.find()
            console.log(burgers)
           return res.render('home',{burgers:burgers })

//-------------------to same task can be done by below code .........i have preferred async and awaut method (above)
          //  index(req,res){
            //     Menu.find().then(function(burgers){
            //         console.log(burgers)
            //         return res.render('home',{burgers:burgers })
            
            // })}

    }
    }
}

module.exports = homeController