import mongoose from "mongoose";

const {Schema, model} = mongoose;

const CommnentSchema = new Schema({

    descCmnt: { 
        type: 'string',
        },
    dateCmnt: { 
        type: 'date',
    },
    userCmnt: {
        type: Schema.Types.ObjectId,  // Référence à l'utilisateur
        ref: "User",  // Nom du modèle auquel cette référence correspond
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "replies"
      }]
    
});

export default model ("comment",CommnentSchema);
