import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

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

//change order status
let statuses = document.querySelectorAll('.status_line')
// console.log(statuses)
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)

let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted) {
            status.classList.add('step-completed')
        }
        if(dataProp ===order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }

    })
}
updateStatus(order);

//socket 
let socket = io()


//join
if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath=window.location.pathname
// console.log(adminAreaPath)
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join','adminRoom')
}
socket.on('orderUpdated',(data)=>{
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type:'success',
        timeout:1000,
        text: 'Order updated',
        progressBar:false,
    }).show();
})