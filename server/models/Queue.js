const mongoose = require('mongoose');
const queueSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    currentLength : {
        type: Number,
        default:0
    },
    maxCapacity : {
        type: Number,
        required : true
    },
    serviceRate: {
        type : Number,
        required : true
    },
    isPaused :{
        type:Boolean,
        default:false
    },
    history:[
        {
            timestamp:{
                type:Date
            },
            length:{
                type:Number
            },
            waitTime:{
                type:Number
            }
        }
    ]
},{timestamp:true});

module.exports = mongoose.model('Queue',queueSchema);