import mongoose from "mongoose";

const {Schema, model} = mongoose;

const UserSchema = new Schema({

    userName: { 
        type: 'string',
        required: true,
    },
    userLastName: { 
        type: 'string',
        required: true,
    },
    emailUser: { 
        type: 'string',
        required: true,
        unique: true,
    },
    mtpUser: { 
       type: 'string',
       required: true,
    },
    role:{
        type: 'string',
        required: true,
        enum :["user", "admin"],
        default : 'user'
    },
    connectedUser: { 
        type: 'string',
    },
    avatarUrl:{
        type: 'string'
    },
    Cmnt: {
        type: Schema.Types.ObjectId,  
        ref: "comment",  
    },
    verificationToken: { 
        type: 'String' 
    },
    verifyUser: { 
        type: Number, 
        default: 0 
    },
    lastLoginIp: {
        type: [String],
        default: [] 
      }


});

export default model ("User",UserSchema);
