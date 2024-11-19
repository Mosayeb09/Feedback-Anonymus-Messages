import mongoose, {Schema, Document} from "mongoose";


export interface Message extends Document{
    content:string;
    createdAt:Date
}


const MessageSchema:Schema<Message> = new Schema({

    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }

})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerifyed:boolean,
    isAcceptingMessage:boolean;
    messages:Message[]

}

const UserSchema:Schema<User> = new Schema({

    username:{
        type:String,
        required:[true,'Username is requred'],
        trim:true,
        unique:true

    },
    email:{
        type:String,
        required:[true,'Email is requred'],
        unique:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'please use a valid email address'    ]
    },
    password:{
        type:String,
        required:[true,'Password is requred']
    },
    verifyCode:{
        type:String,
        required:[true,' verifyCode is requred']
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,' verifyCodeExpiry is requred']
    },
    isVerifyed:{
        type:Boolean,
       default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:false 
    },
    messages:[MessageSchema]



})


const UserModel = (mongoose.models.User as mongoose.Model<User>) ||  mongoose.model<User>('User',UserSchema)



export default UserModel;