const mongoose= require('mongoose')
const Schema= mongoose.Schema

const orderSchema = new Schema({
    customerId:{
          // we need user id ------so created fields
         // we dont want only id ...we want user k sath wala connection 
          //order collection ko user cllection k sath link kkre
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true
    }, 
    items: {type:Object, required:true},
    phone: {type: String, required: true},
    address: {type:String, required: true},
    paymentType: {type:String, default:'COD'},
    status:{type:String,default:'order_placed'}
},{timestamps:true})

module.exports= mongoose.model('Order',orderSchema)