import Comment from "../models/comment.js";
import Tache from "../models/tache.js";

export const createComment = async (req, res) => {
  const { tacheId, descCmnt, dateCmnt, parentCommentId, user } = req.body;

  try {
    // Créez un nouveau commentaire avec l'ID de l'utilisateur
    const newComment = new Comment({
      descCmnt,
      dateCmnt: dateCmnt || Date.now(),  // Utilisez la date actuelle si dateCmnt n'est pas fournie
      userCmnt: user.id  // Associez le commentaire à l'ID de l'utilisateur, pas à l'objet utilisateur complet
    });

    const savedComment = await newComment.save();

    if (parentCommentId) {
      // Si parentCommentId est fourni, c'est une réponse
      const parentComment = await Comment.findById(parentCommentId);

      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }

      // Ajouter l'ID de la réponse au tableau des réponses du commentaire parent
      parentComment.replies.push(savedComment._id);
      await parentComment.save();

      // Peupler les données de l'utilisateur et envoyer la réponse
      const populatedReply = await savedComment.populate('userCmnt').execPopulate();
      res.status(201).json({ reply: populatedReply });
    } else {
      // Sinon, ajoutez le commentaire à la tâche
      const updatedTache = await Tache.findByIdAndUpdate(
        tacheId,
        { $push: { cmnt: savedComment._id } },  // Ajoutez l'ID du commentaire au tableau cmnt de la tâche
        { new: true }
      ).populate({
        path: 'cmnt',
        populate: { path: 'userCmnt' }
      });

      if (!updatedTache) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Envoyez la tâche mise à jour en réponse
      res.status(201).json(updatedTache);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the comment' });
  }
};





export async function deleteComment (req,res){
    try{
    const {id}=req.params;
    const x = await Comment.findByIdAndDelete({_id:id});
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}
export async function updateComment (req,res){
    try{
    const {id}=req.params;
    const {descCmnt,dateCmnt}=req.body;
    const x = await Comment.findByIdAndUpdate(
        id,
        {descCmnt,dateCmnt},
        {new : true}
    );
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}

export async function getallCmnt (req, res) {
    try{
        
        const x = await Comment.find().populate('userCmnt').populate('replies').exec();
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}
export async function searchCmntById (req, res) {
    try{
        const {id} = req.params;
        const x = await Comment.findById({_id:id});
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}