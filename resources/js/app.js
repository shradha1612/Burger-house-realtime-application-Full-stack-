import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'

let addToCart =document.querySelectorAll('.add-to-cart')

let cartCounter = document.querySelector('#cartCounter')

function updateCart(burger){
    axios.post('/update-cart',burger)  //path-api and second parameter is the data we have to send
    .then(res=>{                    //if success it goes to then block
        console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type:'success',
            timeout:1000,
            text: 'Item added to cart',
            progressBar:false
        }).show();
    }).catch(err => {
        new Noty({
            type:'error',
            timeout:1000,
            text: 'Something went wrong',
            progressBar:false
        }).show();

    })
}


addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        //server ko req and add it to cart

      //  let burger=JSON.dataset.burger
      //console.log(burger) //it gives data in json we need to convert in object again

        let burger = JSON.parse(btn.dataset.burger)
        updateCart(burger)
        //console.log(burger)
    })
})
//Remove alert message after x second
const alertMsg = document.querySelector('#success-alert')    //successs-alert is the id we have given in order.ejs
if(alertMsg) {
    setTimeout(()=>{
        alertMsg.remove()

    },2000 )
}

initAdmin()

