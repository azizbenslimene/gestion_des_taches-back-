import mongoose from "mongoose";
import Tache from "../models/tache.js";
import Project from "../models/project.js";

export async function createTache(req, res) {
    try {
        const { tacheTitle, descTache, status, dateStartTache, dateEndTache, projectId } = req.body;

        // Créer une nouvelle tâche
        const tache = new Tache({
            tacheTitle,
            descTache,
            status,
            dateStartTache,
            dateEndTache
        });

        // Sauvegarder la tâche dans la base de données
        const savedTache = await tache.save();

        // Mettre à jour le projet avec l'ID de la tâche
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $push: { taches: savedTache._id } },
            { new: true } // Retourner le projet mis à jour
        ).populate('taches'); // Peupler les tâches dans le projet

        if (!updatedProject) {
            return res.status(404).json({ error: "Projet non trouvé" });
        }

        // Répondre avec le projet mis à jour incluant les tâches peuplées
        res.status(200).json(updatedProject);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la création de la tâche" });
    }
}

export async function deleteTache (req, res) {
try{
    const {idTache} = req.params;
    const x = await Tache.findByIdAndDelete({_id:idTache});
    res.status(200).json(x);

}catch(e){
    console.error(e);
    res.status(500).json({ error: "error" });
}
}

export async function updateTache(req, res) {
    try {
        const { idTache } = req.params;
        console.log("ID Tache reçu :", idTache); 
        const { tacheTitle, descTache, status, dateStartTache, dateEndTache } = req.body;

        if (!mongoose.Types.ObjectId.isValid(idTache)) {
            return res.status(400).json({ error: "Invalid Tache ID" });
        }

        const updatedTache = await Tache.findByIdAndUpdate(
            idTache,
            { tacheTitle, descTache, status, dateStartTache, dateEndTache },
            { new: true }
        );

        if (!updatedTache) {
            return res.status(404).json({ error: "Tache not found" });
        }

        res.status(200).json(updatedTache);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
}
export async function gettaches(req, res) {
    try {
      const taches = await Tache.find()
        .populate({
          path: 'cmnt',
          populate: {
            path: 'replies',
            populate: { path: 'user' }  // Populez également l'utilisateur des réponses si nécessaire
          }
        })
        .populate('projectAST')
        .populate({
            path: 'cmnt',
            populate: {
              path: 'userCmnt'
                // Populez également l'utilisateur des réponses si nécessaire
            }
          })        .exec();
  
      res.status(200).json(taches);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'error' });
    }
  }
  
export async function searchTacheById (req, res) {
    try{
        const {idTache} = req.params;
        const x = await Tache.findById({_id:idTache});
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}

