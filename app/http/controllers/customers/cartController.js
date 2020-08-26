const {json} = require("express")

function cartControllers() {
    return {
        index(req,res) {
            
            res.render('customers/cart')
    },
        update(req,res){
        // let cart ={
        //     items:{
        //         burgerId:{item: burgerObject, qty:0},
        //     },
        //     totalQty:0,
        //     totalPrice:0
        // }


//for the first time creating cart and adding basic object structure
        if(!req.session.cart){   //if session k andar cart nhi hai then creating cart
            req.session.cart ={         //store this object
                items:{},
                totalQty:0,
                totalPrice:0

            }
            
        }
        let cart =req.session.cart
            //console.log(req.body)
            //check if item does not exist in cart

            if(!cart.items[req.body._id]){
                cart.items[req.body._id]={
                    item: req.body,
                    qty:1
                }
                cart.totalQty =cart.totalQty + 1
                cart.totalPrice =cart.totalPrice + req.body.price

            }
            else{
                cart.items[req.body._id].qty=cart.items[req.body._id].qty + 1
                cart.totalQty=cart.totalQty + 1
                cart.totalPrice= cart.totalPrice + req.body.price
            }
        return res.json({totalQty:req.session.cart.totalQty})
    }
    
}
}

module.exports= cartControllers;