import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer',
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Product',
        default:[]
    },
    contactInfo: {
        phoneNo: {
            type: String,
            dafault:"",
        }
        
    },

    location: {
       city:{
        type: String,
        default:"",
       },
       state: {
        type: String,
        default:""
       },
       country: {
        type: String,
        default:""
       }
    },
    orders: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Order'
    }
},{timestamps:true});

export const User = mongoose.model('User', userSchema);

//might add profile picture