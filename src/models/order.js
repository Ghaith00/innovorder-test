const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    clientName : {
        type: String,
        required: true
    },
    createdAt : {
        type: Date
    },
    preparationDelay : {
        type: Number,
        required: true
    },
    rushDelay : {
        type: Number,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    nextAvailableDate : {
        day : {
          type : String,
          required : true,
          enum: ['MON', 'TUE', 'THU', 'WED', 'FRI', 'SAT', 'SUN']
        },
        time : {
          type : Number,
          required : true,
          validate : { validator : (num) => { return num % 15 == 0;} }
        }
    }
});

const Orders = mongoose.model('orders', OrderSchema);
module.exports = Orders;
