import mongoose from "mongoose";

const {Schema, model} = mongoose;

const ProjectSchema = new Schema({

    projectName: { 
        type: 'string',
        required: true,
    },
    dateStartProj: { 
        type: 'string',
        required: true,
    },
    dateEndProj: { 
        type: 'string',
        required: true,
    },
    grp:{
        type:[Schema.Types.ObjectId],
        ref: 'Group',
        required: false,
    },
    taches:{
        type:[Schema.Types.ObjectId],
        ref: 'tache',
        required: false,
    }

    
});

export default model ("Project",ProjectSchema);
