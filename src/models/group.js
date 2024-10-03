import mongoose from "mongoose";

const {Schema, model} = mongoose;

const GroupSchema = new Schema({

    owner:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    invitedUser:{
        type:[Schema.Types.ObjectId],
        ref: 'User',
        required: false,
    },
    projectAs:{
        type:Schema.Types.ObjectId,
        ref: 'project',
        required: false,

    },
    groupName: { 
        type: 'string',
        required: true,
    },
    description : {
        type: 'string',
        required: true,
    }
});

export default model ("Group",GroupSchema);