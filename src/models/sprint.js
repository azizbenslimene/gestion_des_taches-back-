import mongoose from "mongoose";

const {Schema, model} = mongoose;

const SprintSchema = new Schema({

    sprintName: { 
        type: 'string',
        required: true,
    },
    dateStartSprint: { 
        type: 'date',
        required: true,
    },
    dateEndSprint: { 
        type: 'date',
        required: true,
    }
});

export default model ("Sprint",SprintSchema);
