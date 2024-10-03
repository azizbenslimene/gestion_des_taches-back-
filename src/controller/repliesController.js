import Replies from "../models/replies.js";
import Comment from '../models/comment.js'; 
import Tache from '../models/tache.js'; 
import comment from "../models/comment.js";


export async function addreplies(req, res) {
  try {
    const { desc, dateR, tacheid, user, cmnt } = req.body;

    // Validate input fields
    if (!desc || !tacheid || !user || !cmnt) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Check if the task exists
    const tacheExists = await Tache.findById(tacheid);
    if (!tacheExists) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the comment exists
    const commentExists = await Comment.findById(cmnt);
    if (!commentExists) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Create a new reply
    const reply = new Replies({ desc, dateR: dateR || new Date(), tacheid, user, cmnt });
    const savedReply = await reply.save();

    // Add the reply to the comment's replies array
    commentExists.replies.push(savedReply._id);
    await commentExists.save();

    // Populate user information in the saved reply
    await savedReply.populate('user', 'userName');

    return res.status(201).json(savedReply);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


// Remove Reply Function
export async function removereplies(req, res) {
  try {
    const { id } = req.params;
    const reply = await Replies.findByIdAndDelete(id);

    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    return res.status(200).json({ message: "Reply deleted successfully", reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update Reply Function
export async function updatereplies(req, res) {
  try {
    const { id } = req.params;
    const { desc, dateR, tacheid, user, cmnt } = req.body;

    // Validate input fields
    if (!desc || !tacheid || !user || !cmnt) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Update reply
    const updatedReply = await Replies.findByIdAndUpdate(
      id,
      { desc, dateR, tacheid, user, cmnt },
      { new: true }
    );

    if (!updatedReply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    return res.status(200).json(updatedReply);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


export async function getreplies(req, res) {
  try {
    const x = await Replies.find()
      .populate('tacheid')  
      .populate('cmnt')
      .populate('user')
      .exec();
    res.status(200).json(x);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
