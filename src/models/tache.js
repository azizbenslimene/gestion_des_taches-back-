import mongoose from "mongoose";

const {Schema, model} = mongoose;

const TacheSchema = new Schema({

    tacheTitle: { 
        type: 'string',
        required: true,
    },
    descTache:{
        type: 'string',
        required: true,
    },
    status:{
        type :'string',
        required: true,
         enum :['A faire' , 'En cours' , 'Fait'],
        default : 'A faire'
    },
    dateStartTache: { 
        type: 'Date',
        required: true,
    },
    dateEndTache: { 
        type: 'Date',
        required: true,
    },
    cmnt:{
        type:[Schema.Types.ObjectId],
        ref: 'comment',
        required: false,
    },
    projectAST: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User,',
    },
  

});

export default model ("tache",TacheSchema);
